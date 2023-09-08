import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import '../styles/Header.css';
import SearchBar from './SearchBar';
import { useIsLoginState } from '../context/isLoginContext';
import { Avatar, Button, Divider, Fade, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../logo.svg' 
import Logout from './sign/Logout';
import { GetUserId } from './user/GetUserId';

const Header = () => {
  const isLogin = useIsLoginState();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setUserId(GetUserId());
  }, []);

  const onClickProfileButton = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickProfileViewButton = () => {
    navigate(`/user/${userId}`);
  };

  const onClickUserInfoButton = () => {
    navigate("/user/update");
  };

  const onClickLooutbutton = () => {
    navigate("/logout");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
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

        
        {isLogin ?
        <>
          <IconButton
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={onClickProfileButton}
          >
            <Avatar></Avatar>
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={onClickProfileViewButton}>프로필</MenuItem>
            <MenuItem onClick={onClickUserInfoButton}>정보 수정</MenuItem>
            <MenuItem onClick={onClickLooutbutton}>로그아웃</MenuItem>
          </Menu>
        </>
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
    </Fragment>
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