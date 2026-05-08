import React from 'react'
import userFriendlyNutrientNames from '../../utilities/userFriendlyNutrientNames';


export default function Pie({nut,index}) {

    const colors = ["#EA5F3A","#F79285","#FBC46C"];


  return (
    <div className='pie'
        style={{backgroundImage:`conic-gradient(
              from -90deg,
              ${colors[index]} 0deg ${nut.percentage * 3.6}deg,
              rgba(0,0,0,0.08) ${nut.percentage * 3.6}deg 360deg
            )`}}>


            <div className='text'>
                <p>{userFriendlyNutrientNames[nut.name]}</p>
            </div>
    </div>
  )
}
