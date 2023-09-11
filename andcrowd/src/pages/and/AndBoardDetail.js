import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Typography from '@mui/material/Typography';
import AndToolBar from "../../components/and/AndToolBar";
import '../../styles/and/AndBoardDetail.css';

const AndBoardDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;

  const navigate = useNavigate();

  const [andBoard, setAndBoard] = useState({});

  useEffect(() => {
    fetchData();
  }, [andId, andBoardId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/${andBoardId}`);

      if (response.ok) {
        const data = await response.json();
        setAndBoard(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const deleteAndBoard = async (andId, andBoardId) => {
    try {
      await axios.delete(`/and/${andId}/board/${andBoardId}/delete`);
      console.log("Deleted andBoard with ID:", andBoardId);
      navigate(`/and/${andId}/board/list`);
    } catch (error) {
      console.error("Error in deleting andBoard:", error);
    }
  };

  const updateAndBoard = (andId, andBoardId) => {
    navigate(`/and/${andId}/board/${andBoardId}/update`);
  };
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return ""; 
  
    const formattedString = dateTimeString.replace("T", " ");
  
    return formattedString;
  };

  return (
    <div>
      <AndToolBar andId={andId} />
  <div>
    <div id='board-detail-box'>
      <Typography id='and-board-tag-dt' >
        {andBoard.andBoardTag === 0 ? '공지사항' : '소식'}
      </Typography>
      <Typography id='and-board-title-dt' >{andBoard.andBoardTitle}</Typography>
      <Typography id='and-board-updatedAt-dt' >
        {formatDate(andBoard.updatedAt)}
      </Typography>
      <Typography id='board-detail-upde'
      onClick={() => updateAndBoard(andId, andBoardId)}
    >
      수정
    </Typography>
      <Typography id='board-detail-upde'
      onClick={() => deleteAndBoard(andId, andBoardId)}
    >
      삭제
    </Typography>
    </div>
    <hr id='and-board-line-dt'></hr>
    <div id='board-content-box'>
      <Typography id='and-board-content-dt' >{andBoard.andBoardContent}</Typography>
    </div>
    <hr id='and-board-line-dt'></hr>
    <br />
    
  </div>
</div>

  );
};

export default AndBoardDetail;
