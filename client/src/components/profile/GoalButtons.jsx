import React from 'react'

export default function GoalButtons({nutrient,chosenNutrientsForm,setChosenNutrientsForm,index}) {

    const goalButtons = [
        {name:"Less than",sign:"<"},
        {name:"Equals",sign:"="},
        {name:"More than",sign:">"}
    ];

    function getButtonClass(type,goal){
        if(type===goal){
            return "selectedType roundButton"
        } else {
            return "roundButton"
        }
    }

    function handleChangeButtons(type){
        let newNutrients = [...chosenNutrientsForm];
        newNutrients[index].goal = type;

        setChosenNutrientsForm(newNutrients);
    }

  return (
    <div className="goalButtonsRow">
        {goalButtons.map((goal,buttonIndex)=>(
            <button
                key={buttonIndex}
                type="button"
                className={getButtonClass(goal.name,nutrient.goal)}
                onClick={()=>handleChangeButtons(goal.name)}
            >
                {goal.sign}
            </button>
        ))}
    </div>
  )
}
