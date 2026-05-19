import React, { useContext, useEffect, useState } from 'react'
import Calendar from './Calendar'
import BarGraph from './BarGraph'
import MealCards from './MealCards'
import '../styles/Homepage.css'

import mealsForOneDate from '../context/mealsForOneDate'
import { useNavigate } from 'react-router-dom'
import profileInfoContext from '../context/profileInfo'

import Day from "../utilities/classes/DayClass";



export default function Homepage() {

  const {profileInfo, currentDay, setCurrentDay} = useContext(profileInfoContext);
  const [daysArray,setDaysArray] = useState([]);


  const navigate = useNavigate();

  async function createFirstDay(){
    const today = new Date();
    const day = new Day(today.toLocaleDateString('en-CA'));
    daysArray.push(day);

    await day.getMeals(profileInfo.id,profileInfo.chosenNutrients);

    if(day.percentageNutrients===null && !profileInfo.chosenNutrients){
      day.percentageNutrients=[{name:"Protein",amount:100}, {name:"Vitamin A, RAE",amount:100},{name:"Vitamin C, total ascorbic acid",amount:100}]
    } else if (day.percentageNutrients===null && profileInfo.chosenNutrients){
      day.percentageNutrients=profileInfo.chosenNutrients.map(n=>{return {name:n.name,amount:0}})
    }

    setCurrentDay(day);
  }

  useEffect(()=>{
    if(profileInfo.id && !currentDay){
      createFirstDay();
    }
  },[profileInfo])




      

  return (
    <div className='Homepage'>

      <mealsForOneDate.Provider value={{currentDay,setCurrentDay,daysArray,setDaysArray}}>
        
        {currentDay && <Calendar />}

        

        {currentDay && currentDay.meals.length!==0 && <>
            <BarGraph /> 
            <MealCards />
        </>}

      </mealsForOneDate.Provider>

      {currentDay && currentDay.meals.length===0 && <div id='noMealWarning'>
          <p>There are no meals for this date.</p>
          <button onClick={()=>navigate("/add-meal", { state: { date: currentDay.date } })} className='textButton'>Add one here</button>
      </div>}

    </div>
  )
}
