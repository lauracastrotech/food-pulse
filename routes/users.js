require("dotenv").config();
var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;

const saltrounds = process.env.SALT_ROUNDS || 10;
const pool = require("../model/pool");



/* POST register new user */
  router.post("/register", async (req, res) => {

    const {username,password} = req.body;

    const passwordHash = await bcrypt.hash(password, +saltrounds);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [userResult] = await connection.query(
        "INSERT INTO users (username, password) VALUES (?,?)",
        [username,passwordHash]
      );

      const newUserId = userResult.insertId;

      await connection.query(
        "INSERT INTO profiles (user_id) VALUES (?)",
        [newUserId]
      );

      await connection.commit();

      res.status(201).json({message:"User registered successfully."});

    } catch (err){
      
      await connection.rollback();

      if(err.code === "ER_DUP_ENTRY"){
        return res.status(400).json({ message: "Username is already taken." });
      }

      console.error("Registration error : ",err);
      res.status(500).json({message:"An error occured during registration."});

    } finally {

      connection.release();

    }
  });

/* POST login user */
  router.post("/login",  async (req, res) => {

  const {username,password} = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const result = await connection.query(
      "SELECT user_id,password FROM users where username = ? ;",
      [username]
    );

    if(!result[0][0]){
      return res.status(404).json({message:"No user exists with that username."})
    }

    const {user_id} = result[0][0];
    const passwordToCompare = result[0][0].password;
    const correctPassword = await bcrypt.compare(password,passwordToCompare);

    if(!correctPassword){

      return res.status(401).json({message:"The password is incorrect."})

    } else {

      const tokenPayload = {user_id, username};
      const token = jwt.sign(tokenPayload,jwtSecret);

      const profile = await connection.query(
        "SELECT chosenNutrients, age, height, weight, profile_picture FROM profiles WHERE user_id = ?;",
        [user_id]
      );

      const profileRow = profile[0][0];
      const rawNutrients = profileRow?.chosenNutrients;
      let chosenNutrientsInArray = null;

      if (rawNutrients) {
        const parsed = typeof rawNutrients === "string" ? JSON.parse(rawNutrients) : rawNutrients;
        chosenNutrientsInArray = Array.isArray(parsed) ? parsed : Object.values(parsed);
      }

      const profileInfo = {
        id: user_id,
        username,
        chosenNutrients: chosenNutrientsInArray,
        age: profileRow?.age || null,
        height: profileRow?.height || null,
        weight: profileRow?.weight || null,
        profilePicture: profileRow?.profile_picture || null,
      }

      res.status(200).json({token, profileInfo});
    }

  } catch(err){

    await connection.rollback();

    console.error("Login error : ",err);
    res.status(500).json({message:"An error occured druing login."});

  } finally {
    connection.release();
  }
   
});

/* Send user_id to the frontend to display meals */
router.post("/token", async(req,res)=>{
  const {token} = req.body;
  try{

    const decoded = jwt.verify(token,jwtSecret);

    const profile = await db("SELECT chosenNutrients, age, height, weight, profile_picture FROM profiles WHERE user_id = ?", [decoded.user_id]);

    if(!profile){
      return res.status(404).json({ message: "Profile not found" });
    }

    const profileRow = profile.data?.[0];
    const rawNutrients = profileRow?.chosenNutrients;
    let chosenNutrientsInArray = null;

    if (rawNutrients) {
      const parsed = typeof rawNutrients === "string" ? JSON.parse(rawNutrients) : rawNutrients;
      chosenNutrientsInArray = Array.isArray(parsed) ? parsed : Object.values(parsed);
    }

    const profileInfo = {
      id: decoded.user_id,
      username: decoded.username,
      chosenNutrients: chosenNutrientsInArray,
      age: profileRow?.age || null,
      height: profileRow?.height || null,
      weight: profileRow?.weight || null,
      profilePicture: profileRow?.profile_picture || null,
    }

    res.status(200).json({message:"Successful login from token", profileInfo});

    
  } catch(err){
    res.status(500).json({message:"Login with token failed", err});
  }
})


module.exports = router;

