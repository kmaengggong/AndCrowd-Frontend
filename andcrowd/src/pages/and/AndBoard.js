import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from "react-router-dom";
import AndToolBar from "../../components/and/AndToolBar";
import CountdownTimer2 from "../../components/and/CountdownTimer2";
import '../../styles/and/AndBoard.css'
import AndRightBox from "../../components/and/AndRightBox"
import { Typography } from "@mui/material";

const AndBoard = () => {
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;
  
  const [and, setAnd] = useState({});
  const [andBoardList, setAndBoardList] = useState([]);
  useEffect(() => {
    fetchData();
  }, [andId]);
  
  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/list`);
      if (response.ok) {
        const data = await response.json();
        setAndBoardList(data);
      } else {
        throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching AndBoard data:", error);
    }
  };
  const sortedAndBoardList = andBoardList.sort((a, b) => a.andBoardTag - b.andBoardTag);
  return (
    <div>
       <AndToolBar andId={andId} />
      <div id='and-board-container'>
          <div id='and-board-content'>
          {sortedAndBoardList.map((andBoard) => (
          <Typography key={andBoard.andBoardId}>
          <Typography id='and-board-tag' >
          {andBoard.andBoardTag === 0 ? '공지사항' : '소식'}
          </Typography>
          <Typography id='and-board-title' display="inline">
          <Link to={`/and/${andId}/board/${andBoard.andBoardId}`}>
            {andBoard.andBoardTitle}
          </Link>
          </Typography>
          <CountdownTimer2 andBoard={andBoard}  display="inline"/>
          <hr id='and-board-line'></hr>
          </Typography>
          ))}
          

          <Link to={`/and/${andId}/board/create`}>글 작성</Link>
          </div>
      </div>
    </div>
    
  );
};

export default AndBoard;
