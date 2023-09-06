// import jwtDecode from "jwt-decode";
// import { useEffect } from "react";
// import { GetNewAccessToken } from "../sign/GetNewAccessToken";

// export const GetUserId = () => {
//     try{
//         const accessToken = jwtDecode(localStorage.getItem("access_token"));
//         if(accessToken.exp < new Date().getTime()/1000){
//             console.log("1");
//             GetNewAccessToken();
//             console.log("2");
//         }
//         return jwtDecode(localStorage.getItem("access_token")).userId;
//     } catch(error){
//         console.error("GetUserId: " + error);
//         return null;
//     }
// };

import jwtDecode from "jwt-decode";

export const GetUserId = () => {
    try{
        return jwtDecode(localStorage.getItem("access_token")).userId;
    } catch(error){
        console.error("GetUserId: " + error);
        return null;
    }
};