import React from 'react';
import {Link} from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header = () => {
    return (
      <div className={styles.header}>
        <Link to="/"><img className={styles.logo} src='http://localhost:3000/logo192.png' alt='no-img' height={30} /></Link>
        <div className={styles.andcrowd}><Link to="/">&Crowd</Link></div>
        <div className={styles.login}><Link to="/login">Log In</Link></div>
      </div>  
    );
};

export default Header;