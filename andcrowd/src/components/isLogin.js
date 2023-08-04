import Cookies from 'js-cookie';

const isLogin = () => !!Cookies.get('token')

export default isLogin;