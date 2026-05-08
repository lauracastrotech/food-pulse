import React, { useContext, useEffect, useState } from 'react'
import ToggleButton from './ToggleButton';
import DropdownList from './DropdownList';
import ModifyButton from './ModifyButton';
import DeleteButton from './DeleteButton';
import MealNutrients from './MealNutrients';
import mealCardContext from '../../context/mealCard';

export default function MealCard() {

    const {openedMeals, index} = useContext(mealCardContext);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(openedMeals.includes(index));
    }, [openedMeals])

  return (
    <>
        <div id='listContainer'>
            <h3 style={{display:"inline"}}>
                Meal #{index+1}
            </h3>

            <ModifyButton/>
            <DeleteButton/>
            <ToggleButton />
        </div>

        {isOpen && <DropdownList />}

        <MealNutrients />
    </>
  )
}
