// 로그아웃 컴포넌트

import { useContext, useEffect } from "react";
import { isLoginContext, useIsLoginState } from "../../context/isLoginContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

const Logout = () => {
    const isLogin = useIsLoginState();
    const {setIsLogin} = useContext(isLoginContext);
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies(['refresh_token', 'oauth2_auth_request']);

    console.log(isLogin);

    useEffect(() => {
        navigate("/");
    }, [isLogin])

    if(!isLogin) return;
    
    localStorage.removeItem('access_token');
    removeCookie("refresh_token");
    removeCookie("oauth2_auth_request");
    setIsLogin(false);
    alert("로그아웃 되었습니다.");
}

export default Logout;