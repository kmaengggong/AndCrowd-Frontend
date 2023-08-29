// import React from 'react';
// import {Link} from 'react-router-dom';
// import styles from '../styles/Header.module.css';

// const Header = () => {
//     return (
//       <div className={styles.header}>
//         <Link to="/"><img className={styles.logo} src='http://localhost:3000/logo192.png' alt='no-img' height={30} /></Link>
//         <div className={styles.andcrowd}><Link to="/">&Crowd</Link></div>
//         <div className={styles.login}><Link to="/login">Log In</Link></div>
//       </div>  
//     );
// };

// export default Header;

import * as React from 'react';
// import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Android from '@mui/icons-material/Android';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import '../styles/Header.css';

const Header = (props) => {
  const { sections, title } = props;
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <IconButton href="/" size="small">
          <Android />
        </IconButton>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          <Link
            color="text.primary"
            href="/"
          >
            {title}
          </Link>
          
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        
        <Link id='login' href="/login" variant="nonlined" size="small" sx={{ml:1, mr:1}}>
          로그인
        </Link>
        <Link id='signUp' href="/signup" variant="nonlined" size="small" >
          회원가입
        </Link>
      </Toolbar>
      <Toolbar
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        // sx={{flexWrap:'wrap'}}
        // component="nav"
        // variant="regular"
        // sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="text.primary"
            noWrap
            key={section.title}
            variant="h6"
            href={section.url}
            sx={{my:1, mx:1.5}}
            // sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
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