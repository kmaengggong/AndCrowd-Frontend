import React from 'react';
import {Link} from 'react-router-dom';
import styles from '../styles/Navigation.module.css';

const navigations = [
    {
        link: '',
        text: '홈'
    },
    {
        link: 'and/list',
        text: '모임'
    },
    {
        link: 'crowd/list',
        text: '펀딩'
    },
    {
        link: 'team',
        text: '팀소개'
    },
    {
        link: 'help',
        text: '도움말'
    }
];

const Navigation = () => {
    return (
        <div className={styles.navigationBar}>
            {navigations.map(nav => (
                <div
                    className={styles.navgationContent}
                    key={nav.link}
                    >
                        <Link to={nav.link}> 
                            {nav.text}
                        </Link>
                    </div>
            ))}
        </div>
    );
};

export default Navigation;