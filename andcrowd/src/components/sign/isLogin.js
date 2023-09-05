import Cookies from 'js-cookie';

const isLogin = () => {
    if(localStorage.getItem('access_token') === null){
        return false;
    }
    console.log(Cookies.getItem('refresh_token'));
}

export default isLogin;