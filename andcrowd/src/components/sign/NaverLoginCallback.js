import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const NaverLoginCallback = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const navigate = useNavigate();

    useEffect(() => {
        try{
            fetch('/api/oauth/naver', {
                method: "POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: {
                    "authorizationCode": code,
                    "state": state
                }
            }).then(res => {
                console.log(res);
                localStorage.setItem("accessToken", res.headers.accessToken);
                navigate("/");
            })
        } catch(error){
            console.error("/api/oauth/naver: " + error);
            navigate("/");
        }
    }, []);

    // return <Loading />;
};