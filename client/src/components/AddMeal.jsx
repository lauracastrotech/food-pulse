import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import "../styles/AddAMeal.css";
import MealForm from './MealForm';

export default function AddMeal() {

    const location = useLocation();

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    const [dateInput,setDateInput]=useState(location.state?.date || today);

    const [warningOn,setIsWarningOn] = useState(false);

  return (
    <div id='AddAMeal'>

      <h2>Log the meal for
        <input type='date' 
              value={dateInput}
              onChange={(event)=>setDateInput(event.target.value)}/>
      </h2>
      <MealForm date={dateInput} functionnality={"create"}/>

    
    </div>

  )
}
