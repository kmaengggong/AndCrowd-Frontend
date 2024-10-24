// 소셜(네이버) 로그인 콜백 컴포넌트

import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { isLoginContext } from "../../context/isLoginContext";
import { useCookies } from "react-cookie";

export const NaverLoginCallback = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const {isLogin, setIsLogin} = useContext(isLoginContext);
    const [, , removeCookie] = useCookies(['oauth2_auth_request']);
    const navigate = useNavigate();

    useEffect(() => {
        try{
            console.log("authorizationCode: " + code);
            console.log("state: " + state);
            fetch(`/api/oauth/naver`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({
                    "code": code,
                    "state": state
                }),
            }).then(res => {
                if(!res.ok){
                    alert("네이버 로그인에 실패했습니다.");
                    return null;
                }
                else{
                    return res.json();
                }
            }).then(data => {
                if(data !== null){
                    alert("네이버 로그인 성공");
                    removeCookie("oauth2_auth_request");
                    localStorage.setItem('access_token', data.accessToken);
                    setIsLogin(true);
                    navigate("/");
                    window.location.reload();
                }
            });
        //     fetch(`https://nid.naver.com/oauth2.0/token?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`, {
        //         headers: {
        //             "Access-Control-Allow-Origin": "*"
        //         }
        //     }).then(res => {
        //         console.log(res);
        //         console.log(res.json());
        //         // localStorage.setItem("access_token", res.headers.accessToken);
        //         navigate("/");
        //     })
        } catch(error){
            console.error("/api/oauth/naver: " + error);
            navigate("/");
        }
    }, []);

    // return <Loading />;
};