import React, { useContext, useEffect, useState } from 'react'
import profileInfoContext from '../../context/profileInfo';
import updateNutrientChanges from '../../utilities/profile/updateNutrientChanges';

export default function UnsavedChangesButton({chosenNutrientsForm}) {

    const {setProfileInfo,profileInfo} = useContext(profileInfoContext);
    const {chosenNutrients,id} = profileInfo

    const [unsavedChanges,setUnsavedChanges] = useState(false);

    function formIsComplete() {
        return chosenNutrientsForm.every(n =>
            n.name !== '' &&
            n.amount > 0 &&
            ['More than','Equals','Less than'].includes(n.goal)
        );
    }

    function compareObjects(obj1,obj2){
        return obj1.name===obj2.name && obj1.amount===obj2.amount && obj1.goal===obj2.goal;
    }

    function checkUnsavedChanges(){
        return !chosenNutrients ||
            !chosenNutrients.every((n, i) => compareObjects(n, chosenNutrientsForm[i]));
    }

    async function update(event){
        event.preventDefault();
        await updateNutrientChanges(id,chosenNutrientsForm,profileInfo,setProfileInfo);
        setUnsavedChanges(false);
    }

    useEffect(()=>{
        if(formIsComplete()) setUnsavedChanges(checkUnsavedChanges());
        else setUnsavedChanges(false);
    },[chosenNutrientsForm])

  return (
    <>
        {unsavedChanges &&
            <button
                className='importantTextButton'
                style={{marginTop:'16px'}}
                onClick={(event)=>update(event)}
            >
                Save nutrients
            </button>
        }
    </>
  )
}
