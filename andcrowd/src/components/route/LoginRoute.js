// 로그인 상태 토큰 확인 라우터

import { useContext } from "react";
import { isLoginContext, useIsLoginState } from "../../context/isLoginContext";
import { Outlet, useNavigate } from "react-router";
import { useCookies } from "react-cookie";

const LoginRoute = () => {
    const isLogin = useIsLoginState();
    const {setIsLogin} = useContext(isLoginContext);
    const navigate = useNavigate();
    const [,, removeCookie] = useCookies(['refresh_token']);

    if(isLogin){
        try{
            fetch('/api/accessTokenValid', {
                method: "POST",
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                }
            }).then((res) => {
                // 일단 액세스 토큰은 삭제
                localStorage.removeItem('access_token');

                // 엑세스 토큰 만료/부적합 or 리프레쉬 토큰 만료/부적합
                if(res.status !== 200){
                    removeCookie("refresh_token");
                    setIsLogin(false);
                    alert("토큰이 유효하지 않습니다. 다시 로그인해주세요.");
                    navigate("/login");
                }

                return res.json();
            }).then(data => {
                console.log("AccessToken is updated via RefreshToken");
                localStorage.setItem('access_token', data.accessToken);
            })
        } catch(error){
            console.error("LoginRoute: " + error);
        }
    }
    
    return <Outlet />;
}

export default LoginRoute;