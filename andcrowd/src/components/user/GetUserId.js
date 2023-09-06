import jwtDecode from "jwt-decode";

export const GetUserId = () => {
    try{
        return jwtDecode(localStorage.getItem("access_token")).userId;
    } catch(error){
        console.error("GetUserId: " + error);
        return null;
    }
};