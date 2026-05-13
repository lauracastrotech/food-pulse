import axios from "axios";

export default async function login(credentials) {
    
    const {username,password} = credentials;

    try {

        let response = await axios.post(`${import.meta.env.VITE_URL_REQUESTS}/api/users/login`, {
            username,password
        },{
            headers:{'Content-Type': 'application/json'}
        });

        const {token,profileInfo} = response.data;

        localStorage.setItem("token", token);
        return {authentification:true, profileInfo};

    } catch(err){
        console.log(err.response.data);

        return {authentification:false,status : err.response.status};
    }
}