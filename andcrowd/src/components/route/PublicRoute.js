import { useIsLoginState } from "../../context/isLoginContext"
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
    const isLogin = useIsLoginState();
    return (
        isLogin === true ? <Navigate to="/" /> : <Outlet />
    );
}

export default PublicRoute;