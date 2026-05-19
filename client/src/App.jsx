import React, { useEffect, useState } from 'react'

import Homepage from './components/Homepage.jsx'
import AddMeal from './components/AddMeal.jsx'

import './App.css'

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Profile from './components/Profile.jsx';
import ReportAnIssue from './components/ReportAnIssue.jsx';

import profileInfoContext from './context/profileInfo.jsx';
import LearnAboutProject from './components/LearnAboutProject.jsx'
import Layout from './components/layout/Layout.jsx'
import Authentification from './components/Authentification.jsx';

import checkToken from "./utilities/authentification/checkToken.js"


function App() {
  let navigate = useNavigate();

  const [profileInfo,setProfileInfo] = useState({
    id:null,
    username:"",
    chosenNutrients:null,
    age:null,
    height:null,
    weight:null,
    profilePicture:null,
  });

  const [currentDay, setCurrentDay] = useState(null);



  async function toCheckToken(){
    const profileInfo = await checkToken();

    if(profileInfo){
      setProfileInfo(profileInfo)
    } else {
      navigate("/register")
    }
  }

  useEffect(()=>{
    toCheckToken()
  },[])



  return (
    <> 
      
      <profileInfoContext.Provider value={{profileInfo,setProfileInfo,currentDay,setCurrentDay}}>
        <Layout>
        <Routes>
          
          <Route path="/" element={<Homepage />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/add-meal" element={<AddMeal />}/>
          <Route path='/register' element={<Authentification type={"register"} />} />
          <Route path='/login' element={<Authentification type={"login"}/>} />
          
          
          <Route path='/report-issue' element={<ReportAnIssue />} />
          <Route path="/about-project" element={<LearnAboutProject />} />
          
        </Routes>
        </Layout>
      </profileInfoContext.Provider>
      
      
    </>
  )
}

export default App
