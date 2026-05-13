var express = require('express');
var router = express.Router();
const db = require('../model/helper');


const nutrientNames = [ "Energy","Protein", "Carbohydrate, by difference","Total lipid (fat)","Fiber, total dietary","Total Sugars","Calcium, Ca","Iron, Fe","Potassium, K","Sodium, Na","Vitamin A, RAE","Vitamin C, total ascorbic acid","Vitamin D (D2 + D3)","Vitamin E (alpha-tocopherol)","Vitamin K (phylloquinone)","Magnesium, Mg","Zinc, Zn","Cholesterol","Folate, DFE","Fatty acids, total polyunsaturated" ]


function checksValidFormat(obj){
  if(typeof obj !== "object" || obj === null) return false;
  const values = Object.values(obj);
  if(values.length === 0) return false;
  return values.every(n =>
    typeof n === "object" &&
    n !== null &&
    typeof n.name === "string" &&
    typeof n.amount === "number" &&
    typeof n.goal === "string" &&
    nutrientNames.includes(n.name) &&
    ["More than","Equals","Less than"].includes(n.goal)
  );
}

/* PUT profile information*/
// router.put("/profiles/profile_id", userMustExist, async (req, res) => {
router.put("/:profile_id", async (req, res) => {
  const {profile_id} = req.params
  const { chosenNutrients } = req.body;

  if(!checksValidFormat(chosenNutrients)) return res.status(401).json({message:"Object has an incorrect format."});

  const jsonObject = JSON.stringify(chosenNutrients);
  
  try {
    // Add the user's profile informaiton
    await db(
      "UPDATE profiles SET chosenNutrients = ? WHERE profile_id = ?",
      [jsonObject, profile_id]
    );

      // Send a success message to the frontend
       res.status(201).json("Updated chosen nutrients");
  } catch (err) {
    res.status(500).json(err);
  }
});


/* PUT profile info (age, height, weight, picture) */
router.put("/:user_id/info", async (req, res) => {
  const { user_id } = req.params;
  const { age, height, weight, profile_picture } = req.body;

  try {
    await db(
      "UPDATE profiles SET age=?, height=?, weight=?, profile_picture=? WHERE user_id=?",
      [age || null, height || null, weight || null, profile_picture || null, user_id]
    );
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Error updating profile info:", err);
    res.status(500).json({ message: "Error updating profile." });
  }
});

module.exports = router;
