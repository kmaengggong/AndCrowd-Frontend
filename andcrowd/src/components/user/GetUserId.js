// 유저 ID 가져오는 컴포넌트

import jwtDecode from "jwt-decode";

export const GetUserId = () => {
    try{
        return jwtDecode(localStorage.getItem("access_token")).userId;
    } catch(error){
        console.error("GetUserId: " + error);
    }
};