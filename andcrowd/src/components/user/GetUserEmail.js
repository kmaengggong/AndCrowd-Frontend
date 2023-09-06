import jwtDecode from "jwt-decode";
import { useEffect } from "react";

export const GetUserEmail = () => {
    try{
        fetch('/api/accessTokenValid', {
            method: "POST",
            headers:{
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json; text=utf-8'
            }
        }).then(res => {
            console.log(res);
            console.log(res.json());
        });
        return jwtDecode(localStorage.getItem("access_token")).userId;
    } catch(error){
        console.error("GetUserId: " + error);
        return null;
    }
};