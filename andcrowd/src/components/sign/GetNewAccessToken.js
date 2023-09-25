// 새 토큰 발급 컴포넌트

import { useContext } from "react";
import { isLoginContext, useIsLoginState } from "../../context/isLoginContext";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const GetNewAccessToken = () => {
    const isLogin = useIsLoginState();
    const {setIsLogin} = useContext(isLoginContext);
    const navigate = useNavigate();
    const [,, removeCookie] = useCookies(['refresh_token']);

    const getNewAccessToken = async () => {
        try{
            await fetch('/api/getNewAccessToken', {
                method: "POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                } 
            }).then(res => {
                console.log(res);
                if(res.status !== 200){
                    return false;
                }
                return res.json();
            }).then(data => {
                // 리프레쉬 토큰도 만료시
                if(!data){
                    console.log("RefreshToken is not valid");
                    setIsLogin(false);
                    removeCookie("refresh_token");
                    alert("토큰이 유효하지 않습니다. 다시 로그인해주세요.");
                    navigate("/login");
                }
                else{
                    console.log("AccessToken is updated via RefreshToken");
                    localStorage.setItem('access_token', data.accessToken);
                }
            })
        } catch(error){
            console.error("/api/getNewAccessToken: " + error);
        }
    }

    if(isLogin){
        try{
            fetch('/api/accessTokenValid', {
                method: "POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "accessToken": localStorage.getItem('access_token')
                })
            }).then((res) => {
                // 엑세스 토큰 만료 시
                if(res.status !== 200){
                    // 엑세스 토큰 삭제 후
                    localStorage.removeItem('access_token');
                    console.error("AccessToken is not Valid!");
                    // 리프레쉬 토큰을 통해 엑세스 토큰 재발급 시도
                    getNewAccessToken();
                }
            })
        } catch(error){
            console.error("/api/accessTokenValid: " + error);
        }
    }
    else{
        alert("로그인이 필요합니다");
    }
}