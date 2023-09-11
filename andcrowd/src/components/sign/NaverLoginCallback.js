import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const NaverLoginCallback = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const navigate = useNavigate();

    const grantType = "authorization_code";
    const clientId = "VuPedkCMX9rG5c9njrEN";
    const clientSecret = "BrOSKdntY6";

    useEffect(() => {
        try{
            console.log("authorizationCode: " + code);
            console.log("state: " + state);
            fetch(`https://nid.naver.com/oauth2.0/token?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            }).then(res => {
                console.log(res);
                console.log(res.json());
                // localStorage.setItem("access_token", res.headers.accessToken);
                navigate("/");
            })
        } catch(error){
            console.error("/api/oauth/naver: " + error);
            navigate("/");
        }
    }, []);

    // return <Loading />;
};