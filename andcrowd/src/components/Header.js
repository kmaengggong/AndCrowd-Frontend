import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Android from '@mui/icons-material/Android';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import '../styles/Header.css';
import SearchBar from './SearchBar';
import { isLoginContext } from '../context/isLoginContext';
import { Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const { sections, title } = props;
  const {isLogin, setIsLogin} = React.useContext(isLoginContext);
  const [, , removeCookie] = useCookies(['refresh_token']);
  const navigate = useNavigate();

  const onClickLogoutButton = () => {
    localStorage.removeItem('access_token');
    removeCookie("refresh_token");
    removeCookie("refresh_token");
    setIsLogin(false);
    alert("로그아웃 되었습니다.");
    navigate("/");
  }

  return (
    <React.Fragment>
      <Toolbar id ='mainTool' sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Link id='navText' href="/" variant="nonlined" size="small" sx={{ml:1, mr:1}}>
          홈
        </Link>
        <Link id='navText' href="/and/list" variant="nonlined" size="small" >
          모임
        </Link>
        <Link id='navText' href="/crowd/list" variant="nonlined" size="small" sx={{ml:1, mr:1}}>
          펀딩
        </Link>
        <Link id='navText' href="/team" variant="nonlined" size="small" >
          팀소개
        </Link>
        <Link id='navText' href="/help" variant="nonlined" size="small">
          도움말
        </Link>

         <Link id='logo' href="/">
            {title}
         </Link>
         <SearchBar />

        {isLogin ?
        <Button id='logout' onClick={onClickLogoutButton}>로그아웃</Button>
        :
        <>
         <Link id='login' href="/login">
           로그인 
         </Link>
         <Link id='signUp' href="/signUp">
           회원가입
         </Link>
        </>
        }
      </Toolbar>
     
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;