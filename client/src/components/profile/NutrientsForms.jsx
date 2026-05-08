import React, { useContext, useEffect, useState } from 'react'
import profileInfoContext from '../../context/profileInfo'
import GoalButtons from './GoalButtons';
import Inputs from './Inputs';
import UnsavedChangesButton from './UnsavedChangesButton';

export default function NutrientsForms() {

    const {chosenNutrients,id} = useContext(profileInfoContext).profileInfo;

    const [chosenNutrientsForm,setChosenNutrientsForm] = useState([
            {name:"",amount:0,goal:""},
            {name:"",amount:0,goal:""},
            {name:"",amount:0,goal:""}
        ])

    useEffect(()=>{
        if(chosenNutrients){
            setChosenNutrientsForm(JSON.parse(JSON.stringify(chosenNutrients)))
        }
    },[id])

  return (
    <>
        <h3>Nutrients to track</h3>

        <p style={{marginBottom:"8px"}}>
            Choose up to 3 nutrients to track daily. For each one, set a goal amount in grams and whether your target is less than, equal to, or greater than that amount.
        </p>

        <p style={{marginBottom:"30px",fontSize:"0.925rem"}}>
            Food Pulse does not provide medical advice. All medical or clinical questions should be directed to your doctor or a qualified medical professional.
        </p>

        <div id="flexGoalNutrients">
        {chosenNutrientsForm.map((nutrient,index)=>(
            <div className='nutrientDiv' key={index}>

                <GoalButtons nutrient={nutrient} chosenNutrientsForm={chosenNutrientsForm} setChosenNutrientsForm={setChosenNutrientsForm} index={index}/>

                <Inputs nutrient={nutrient} index={index} chosenNutrientsForm={chosenNutrientsForm} setChosenNutrientsForm={setChosenNutrientsForm} />

            </div>
        ))}
        </div>

        <UnsavedChangesButton chosenNutrientsForm={chosenNutrientsForm} />
    </>
  )
}
