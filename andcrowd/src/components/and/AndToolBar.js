import React from 'react';
import { Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../styles/and/AndToolBar.css';

const AndToolBar = ({ andId }) => {
  return (
    <Toolbar id="and-tool" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Link
        id='and-navText'
          to={`/and/${andId}`}
         variant="nonlined" 
         size="small" 
       >
       상세정보
     </Link>
      <Link
        id="and-navText"
        to={`/and/${andId}/board/list`}
        variant="nonlined"
        size="small"
      >
        공지사항
      </Link>
      <Link
        id="and-navText"
        to={`/and/${andId}/qna/list`}
        variant="nonlined"
        size="small"
      >
        Q&A
      </Link>
      
   </Toolbar>
 );
};

export default AndToolBar;
