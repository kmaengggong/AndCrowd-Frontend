import {useEffect, useRef} from 'react';
import Button from '@mui/material/Button';
import '../styles/Login.css';

const NaverLogin = ({setGetToken, setUserInfo}) => {
    const naverRef = useRef();
    const {naver} = window;
    const NAVER_CLIENT_ID = "VuPedkCMX9rG5c9njrEN";
    const NAVER_CALLBACK_URL = "BrOSKdntY6";

    const initNaverLogin = () => {
        const naverLogin = new naver.LoginWithNaverId({
            clientId: NAVER_CLIENT_ID,
            callbackUrl: NAVER_CALLBACK_URL,
            isPopup: false,
            loginButton: {color: 'green', type: 3, height: 58},
            callbackHandle: true,
        })
        naverLogin.init();
        naverLogin.getLoginStatus = (async function (status){
            if(status){
                const userid = naverLogin.user.getEmail();
                const username = naverLogin.user.getName();
            }
        });
    }
    const userAccessToken = () => {
        window.location.href.includes('access_token') && getToken();
    };

    const getToken = () => {
        const token = window.location.href.split('=')[1].split('&')[0];
    }

    // useEffect(() => {
    //     initNaverLogin();
    //     userAccessToken();
    // }, []);

    const handleNaverLogin = () => {
        naverRef.current.children[0].click();
    };

    return(
        <>
            <Button id='naver-login-button' onClick={handleNaverLogin} >
            </Button>
        </> 
    );
}

export default NaverLogin;