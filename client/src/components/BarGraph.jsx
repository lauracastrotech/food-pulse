
import { useContext } from 'react';
import '../styles/BarGraph.css'
import userFriendlyNutrientNames from '../utilities/userFriendlyNutrientNames';
import unitNutrients from '../utilities/measurmentUnitNutrients';
import profileInfoContext from '../context/profileInfo';
import mealsForOneDate from '../context/mealsForOneDate';
import Pie from './barGraph/Pie';
import Amount from './barGraph/Amount';


export default function BarGraph() {

    const {currentDay} = useContext(mealsForOneDate)
    const {profileInfo} = useContext(profileInfoContext);

    return (
      <>
        <h2 style={{textAlign:"center",margin:"0",marginTop:"50px"}}>Your nutrients</h2>
        <div className = "BarGraph">
          
        {
        currentDay && currentDay.percentageNutrients && profileInfo.chosenNutrients &&
        currentDay.percentageNutrients.map((nut,index)=>(

          <div key={index}>
          
            <Pie nut={nut} index={index}/>


          <Amount nut={nut}
            currentDay={currentDay}
            chosenNutrients={profileInfo.chosenNutrients}/>

         
          </div>

        ))}

        </div>

      </>
    )
}
