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
import logo from '../logo.svg' 
import { GetUserId } from './user/GetUserId';
import { GetUserInfo } from './user/GetUserInfo';
import LoginIcon from '@mui/icons-material/Login';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import GavelIcon from '@mui/icons-material/Gavel';

const Header = () => {
  const isLogin = useIsLoginState();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if(isLogin){
      setUserId(GetUserId());
    }
  }, []);

  useEffect(() => {
    if(isLogin && userId !== null){
      GetUserInfo(userId, setUserInfo);
    }
  }, [isLogin, userId]);

  const onClickProfileButton = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickProfileViewButton = () => {
    navigate(`/user/${userId}`);
    handleClose();
  };

  const onClickUserInfoButton = () => {
    navigate("/user/update");
    handleClose();
  };

  const onClickLooutbutton = () => {
    navigate("/logout");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if(window.location.pathname.startsWith("/iamtheadmin")) return null;

  return (
    <Fragment>
      <Toolbar id ='mainTool' sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <div id='nav-box'>
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
        <Link id='navText' href="/infoboard/list" variant="nonlined" size="small">
          공지
        </Link>
        </div>
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
            <Avatar src={userInfo.userProfileImg} loading="lazy" sx={{width: 45, height: 45, marginLeft:1}} />
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
            <MenuItem onClick={onClickProfileViewButton}><AccountCircleIcon sx={{mr:1}} />프로필</MenuItem>
            <MenuItem onClick={onClickUserInfoButton}><EditIcon sx={{mr:1}} />정보 수정</MenuItem>
            <MenuItem onClick={onClickLooutbutton}><LogoutIcon sx={{mr:1}} />로그아웃</MenuItem>
          </Menu>
        </>
        :
        <>
          <IconButton href="/login" sx={{ml:1}}>
            <LoginIcon />
          </IconButton>
          <IconButton href="/signup">
            <AssignmentIndIcon />
          </IconButton>
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