import React, { useState } from 'react'
import SubmitButton from './SubmitButton'

export default function AuthentificationForm({credentials,setCredentials,type}) {

    const [errorMessage,setErrorMessage] = useState("");
    const [readPassword,setReadPassword] = useState(false);

    function handleChange(event){
        const {name,value} = event.target;

        setCredentials(prev => ({...prev, [name]:value}));
    }

  return (
    <form>

        <label>
            Your username

            <input
                type='text'
                name='username'
                value={credentials.username}
                autoComplete='off'
                onChange={(event)=>handleChange(event)}
            />
        </label>

        <label>
            Your password

            <input
                type={readPassword?"text":"password"}
                name='password'
                value={credentials.password}
                autoComplete='new-password'
                onChange={(event)=>handleChange(event)}
            />
            <i className={readPassword?'fi fi-rr-eye-crossed'
            :'fi fi-rr-eye'} 
                onClick={()=>setReadPassword(!readPassword)}>
            </i>
        </label>

        <p>{errorMessage}</p>

        <SubmitButton type={type} credentials={credentials} setErrorMessage={setErrorMessage} setCredentials={setCredentials}/>

    </form>
  )
}
