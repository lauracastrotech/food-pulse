import React, { useContext, useEffect, useState } from 'react'
import mealCardContext from '../../context/mealCard';

export default function ToggleButton() {

    const {openedMeals, setOpenedMeals, index} = useContext(mealCardContext);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(openedMeals.includes(index));
    }, [openedMeals])

    function handleToggleOpen() {
        const newList = isOpen
            ? openedMeals.filter(m => m !== index)
            : [...openedMeals, index];
        setOpenedMeals(newList);
    }

  return (
        <button
            className='textButton'
            style={{fontSize:"0.75rem", opacity: 0.6}}
            onClick={handleToggleOpen}
        >
            {isOpen ? 'Hide ingredients' : 'Show ingredients'}
        </button>
  )
}
