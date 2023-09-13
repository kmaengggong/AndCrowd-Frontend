import React from "react";
import { Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../styles/crowd/CrowdToolBar.css';

const CrowdToolBar = ({ crowdId }) => {
    return(
        <Toolbar id="crowd-tool" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Link
                id='crowd-navText'
                to={`/crowd/${crowdId}`}
                variant="nonlined" 
                size="small" 
            >
            상세정보
            </Link>
            <Link
                id="crowd-navText"
                to={`/crowd/${crowdId}/board/all`}
                variant="nonlined"
                size="small"
            >
            게시판
            </Link>
            <Link
                id="crowd-navText"
                to={`/crowd/${crowdId}/qna/all`}
                variant="nonlined"
                size="small"
            >
                Q&A
            </Link>
            
        </Toolbar>
    );
};

export default CrowdToolBar;