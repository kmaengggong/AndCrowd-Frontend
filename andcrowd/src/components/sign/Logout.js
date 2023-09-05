import { useContext } from "react";
import { isLoginContext } from "../../context/isLoginContext";
import { useCookies } from "react-cookie";

export const Logout = () => {
    const [isLogin, setIsLogin] = useContext(isLoginContext);
    const navigate = navigator();
    localStorage.removeItem('access_token');
    const [, , removeCookie] = useCookies(['refresh_token']);
    removeCookie("refresh_token");
    setIsLogin(false);
    alert("로그아웃 되었습니다.");
    navigate("/");
}