import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';   
import Link from '@mui/material/Link';
import '../styles/Header.css';
import SearchBar from './SearchBar';
import logo from '../logo.svg' 

const Header = (props) => {
  const { sections, title } = props;
  return (
    <React.Fragment>
      <Toolbar id ='mainTool' sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Link id='navText' href="/" variant="nonlined" size="small" sx={{ml:1, mr:1}}>
          홈
        </Link>
        <Link id='navText' href="/and/scroll" variant="nonlined" size="small" >
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
          <img id ='logoimg' src={logo} alt="Logo" /> 
         </Link>
         <SearchBar />

         <Link id='login' href="/login">
           로그인 
         </Link>
         <Link id='signUp' href="/signUp">
           회원가입 
         </Link>

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