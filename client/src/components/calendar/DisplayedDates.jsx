import React, { useContext } from 'react'
import profileInfoContext from '../../context/profileInfo'
import mealsForOneDate from '../../context/mealsForOneDate';
import Day from "../../utilities/classes/DayClass"

export default function displayedDates({displayedDates}) {

    const {profileInfo} = useContext(profileInfoContext);
    const {daysArray, setDaysArray,currentDay,setCurrentDay} = useContext(mealsForOneDate)

    const week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


    async function handleChangeDate(event,date){
            event.preventDefault();
    
            let newDay = daysArray.find(d=>d.date===date);
    
            if(!newDay){
                // console.log(date);
                newDay = new Day(date);
                await newDay.getMeals(profileInfo.id,profileInfo.chosenNutrients);
                // newDay = Object.assign(Object.create(Object.getPrototypeOf(newDay)), newDay);
                
                setDaysArray([...daysArray, newDay]);
            }
    
            setCurrentDay(newDay);
    
        }


  return (
    <>
        {displayedDates.map((date,index)=>(
            <div
                className={date==currentDay.date?"selectedDate dateBlock":"dateBlock"}
                key={index}
                onClick={(event)=>handleChangeDate(event,date)}
            >
                <p className='greyText'>
                    {week[new Date(date + 'T00:00:00').getDay()]}
                </p>

                <p className='numberDate'>
                    {new Date(date + 'T00:00:00').getDate()}
                </p>

                <p className='greyText'>
                    {month[new Date(date + 'T00:00:00').getMonth()]}
                </p>
            </div>
        ))}
    </>
  )
}
