import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Typography from '@mui/material/Typography';
import AndToolBar from "../../components/and/AndToolBar";
import '../../styles/and/AndBoardDetail.css';
import { GetUserId } from "../../components/user/GetUserId";

const AndBoardDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;

  const navigate = useNavigate();

  const [andBoard, setAndBoard] = useState({});
  const [boardUserId, setBoardUserId] = useState(null);
  const userId = GetUserId(); // 현재 로그인 중인 사용자 id

  useEffect(() => {
    fetchData();
  }, [andId, andBoardId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/${andBoardId}`);

      if (response.ok) {
        const data = await response.json();
        setAndBoard(data);
        setBoardUserId(data.userId);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const deleteAndBoard = async (andId, andBoardId) => {
    const isConfirmed = window.confirm("정말로 해당 글을 삭제하시겠습니까?");
    if (isConfirmed) {
    try {
      await axios.delete(`/and/${andId}/board/${andBoardId}/delete`);
      console.log("Deleted andBoard with ID:", andBoardId);
      navigate(`/and/${andId}/board/list`);
    } catch (error) {
      console.error("Error in deleting andBoard:", error);
    }
    } else {
      console.log("글 삭제가 취소되었습니다.");
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
      {/* 해당 글 작성자만 수정/삭제 가능 */}
      {userId === boardUserId && (
      <>
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
      </>
      )}
    </div>
    <hr id='and-board-line-dt'></hr>
    <div id='board-content-box'>
      <div id='and-board-content-dt' dangerouslySetInnerHTML={{ __html :  andBoard.andBoardContent  }}></div>
    </div>
    <hr id='and-board-line-dt'></hr>
    <br />
    
  </div>
</div>

  );
};

export default AndBoardDetail;
