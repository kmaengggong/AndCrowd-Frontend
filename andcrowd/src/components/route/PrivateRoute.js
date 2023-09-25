// 로그인 필요 라우터

import { useIsLoginState } from "../../context/isLoginContext"
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
    const isLogin = useIsLoginState();
    if(!isLogin) alert("로그인이 필요합니다");
    
    return (
        isLogin === true ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoute;