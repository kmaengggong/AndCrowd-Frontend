import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
    return (
      <div>
        <Link to="/"><h3>Header</h3></Link>
        <Link to="/login">Log In</Link>
      </div>  
    );
};

export default Header;