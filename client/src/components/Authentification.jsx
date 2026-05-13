import React, { useEffect, useState } from 'react'
import AuthentificationForm from './authentification/AuthentificationForm'
import "../styles/Authentification.css"
import NavigateToOtherType from './authentification/NavigateToOtherType'

export default function Authentification({type}) {

    const defaultCredentials = {
        username:"",
        password:""
    }

    const [credentials,setCredentials] = useState(defaultCredentials)

    useEffect(()=>{
        setCredentials(defaultCredentials);
    },[type])

  return (
    <div id='Authentification'>

        <h1>
            {type==="login"? "Login to continue" :
            type==="register" ? "Sign up to start" :
            ""}
        </h1>

        <AuthentificationForm credentials={credentials} setCredentials={setCredentials} type={type}/>

        <NavigateToOtherType type={type}/>


    </div>
  )
}
