import { Navigate } from "react-router"

export const SignRoute = ({isLogin, link}) => {
    return(
        !isLogin ? <Navigate to="/" /> : link
    );
}