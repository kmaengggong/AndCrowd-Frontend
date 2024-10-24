// 로그인 하면 안되는 라우터

import { useIsLoginState } from "../../context/isLoginContext"
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
    const isLogin = useIsLoginState();
    return (
        isLogin === true ? <Navigate to="/" /> : <Outlet />
    );
}

export default PublicRoute;