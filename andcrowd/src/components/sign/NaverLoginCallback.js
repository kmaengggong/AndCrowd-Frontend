import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"

export const NaverLoginCallback = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('status');

    useEffect(() => {
        fetch('/api/oauth/naver', {
            method: "POST",
            body: {
                "authorizationCode": code,
                "state": state
            }
        }).then(res => {
            console.log(res);
            localStorage.setItem("accessToken", res.headers.accessToken);
            // navigate to /
        })  // try-catch, login으로
    }, []);

    // return <Loading />;
};