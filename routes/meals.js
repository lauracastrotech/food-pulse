var express = require('express');
var router = express.Router();
const db = require('../model/helper');
const pool = require("../model/pool");

const nutrientNames = [ "Energy","Protein", "Carbohydrate, by difference","Total lipid (fat)","Fiber, total dietary","Total Sugars","Calcium, Ca","Iron, Fe","Potassium, K","Sodium, Na","Vitamin A, RAE","Vitamin C, total ascorbic acid","Vitamin D (D2 + D3)","Vitamin E (alpha-tocopherol)","Vitamin K (phylloquinone)","Magnesium, Mg","Zinc, Zn","Cholesterol","Folate, DFE","Fatty acids, total polyunsaturated" ]


function checkObjectFormat(obj, type) {
  if (!obj || typeof obj !== "object") return false;

  if (type === "nutrients") {
    const keys = Object.keys(obj);
    return (
      keys.length === 20 &&
      keys.every((key) => nutrientNames.includes(key) && typeof obj[key] === "number")
    );
  } else if (type === "ingredients") {
    return Object.entries(obj).filter(e=>e).every(
      ([key, value]) => typeof key === "string" && typeof value === "number"
    );
  }
  return false;
}

/* GET meals, ingredients, nutrients*/
router.get("/:profile_id/:date", async(req, res)=>{
  const {profile_id,date}= req.params;

  try {
    const result = await db(
      "SELECT COUNT(*) AS profile_count FROM profiles WHERE profile_id= ? ;",
      [profile_id]
    )

    if(result.data[0].profile_count !== 1) return res.status(404).json({message:"This profile does not exists."});

    const mealsResult = await db(
      "SELECT meal_id, nutrients, ingredients FROM meals WHERE profile_id= ? AND date = ? ;",
      [profile_id,date]
    )


    const parse = (val) => typeof val === 'string' ? JSON.parse(val) : val;

    const meals = mealsResult.data.map(m => {
      const obj = parse(m.ingredients);
      return Object.entries(obj).map(([name, amount]) => ({ name, amount }));
    });

    const nutrients = mealsResult.data.map(m => {
      const obj = parse(m.nutrients);
      return Object.entries(obj).map(([name, amount]) => ({ name, amount }));
    });

  

    res.status(200).json({message:"Successful meal retrieval.",meals,nutrients});

  } catch(err){
    console.error("Error retrieving meals",err);
    res.status(500).json({message:"Error while retrieving meals : ",err})
  }

})

/* POST meal */
router.post('/:profile_id', async(req, res) => {
  const { profile_id } = req.params;
  const { date, nutrients, ingredients} = req.body;

  try {
    if(!checkObjectFormat(nutrients,"nutrients")) return res.status(400).json({message:"Invalid nutrients format."});
    if(!checkObjectFormat(ingredients,"ingredients")) return res.status(400).json({message:"Invalid ingredients format."});


      await db("INSERT INTO meals (profile_id,date,nutrients,ingredients) VALUES (?,?,?,?);",
        [profile_id,date,JSON.stringify(nutrients),JSON.stringify(ingredients)]
      );

      res.status(201).json({message:"Meal created successfully"});

  } catch(err){
    console.error("Error creating meal : ",err);
    res.status(500).json({message:"An error occured during meal creation.",err});
  }

})

/* DELETE meal*/
router.delete("/:profile_id/:date/:index", async (req,res)=>{
  const {profile_id,date,index} = req.params;

  try {

    const [mealIds] = await pool.execute(
      "SELECT meal_id FROM meals WHERE profile_id= ? AND date= ? ;",
      [profile_id,date]
    )

    if(mealIds.length <= Number(index)){
      return res.status(404).json({message:"The index is incorrect."});
    }

    const id = mealIds[index].meal_id;

    await pool.execute(
      "DELETE FROM meals WHERE meal_id= ?;",
      [id]
    )

    const [mealsResult] = await pool.execute(
      "SELECT meal_id, nutrients, ingredients FROM meals WHERE profile_id= ? AND date = ? ;",
      [profile_id,date]
    )


    const meals = mealsResult.map((m)=>m.ingredients);
    const nutrients = mealsResult.map(m=>m.nutrients);
  

    res.status(200).json({message:"Successfuly deleted meal.",meals,nutrients});

  } catch(err){
    console.error("Error deleting meal : ",err);
    res.status(500).json({message:"An error occured during deleting meal.",err});
  }
})


/* PUT meal */
router.put("/:profile_id/:date", async (req,res)=>{
    const {ingredients, nutrients ,index} = req.body;
    const {profile_id,date} = req.params;

  try {

    if(!checkObjectFormat(nutrients,"nutrients")) return res.status(400).json({message:"Invalid nutrients format."});
    if(!checkObjectFormat(ingredients,"ingredients")) return res.status(400).json({message:"Invalid ingredients format."});

    const [mealIds] = await pool.execute(
      "SELECT meal_id FROM meals WHERE profile_id= ? AND date= ? ;",
      [profile_id,date]
    )


    if(mealIds.length <= Number(index)){
      return res.status(404).json({message:"The index is incorrect."});
    }


    const id = mealIds[index].meal_id;

    await pool.execute(
      "UPDATE meals SET nutrients = ?, ingredients = ? WHERE meal_id=?;",
      [JSON.stringify(nutrients),JSON.stringify(ingredients), id]
    )

    const [mealsResult] = await pool.execute(
      "SELECT meal_id, nutrients, ingredients FROM meals WHERE profile_id= ? AND date = ? ;",
      [profile_id,date]
    )

    const meals = mealsResult.map((m)=>m.ingredients);
    const MealNutrients = mealsResult.map(m=>m.nutrients);
  

    res.status(200).json({message:"Successfully updated meal.",meals,nutrients:MealNutrients});



  } catch(err){
    console.error("Error updating meal : ",err);
    res.status(500).json({message:"An error occured during meal updating.",err});
  }
})

module.exports = router;
