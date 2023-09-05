import React, { useState, useEffect } from "react";
import { redirect, useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import AndToolbar from "../../components/and/AndToolBar";
import Typography from '@mui/material/Typography';
import { AiOutlineHeart  ,AiFillHeart} from "react-icons/ai";
import CountdownTimer from "../../components/and/CountdownTimer";
import Box from '@mui/material/Box';
import '../../styles/and/AndDetail.css';

const AndDetail = () => {
  const params = useParams();
  const andId = params.andId;

  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [and, setAnd] = useState({});
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  useEffect(() => {
    fetchData();
  }, [andId]);
  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnd(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  
  };

  const updateAnd = (andId) => {
    navigate(`/and/${andId}/update`);
  };

  const deleteAnd = async (andId) => {
    try {
      await axios.delete(`/and/${andId}/delete`);
      console.log("Deleted and with ID:", andId);
      navigate(`/and/list`);
    } catch (error) {
      console.error("error in deleting and:", error);
    }
  };


  const applyAnd = (andId) => {
    navigate(`/and/${andId}/applicant/create`);
  };

  const applicantList = (andId) => {
    navigate(`/and/${andId}/applicant/list`);
  };

  const andChat = (andId) => {
    navigate(`/and/${andId}/chat`);
  };
  if (and.deleted === true) {
    alert("이 글은 삭제되었습니다.");
    window.location.href = `/and/list`;

  };

  return (
    <div>
      <AndToolbar andId={and.andId} />
      <div> 
       <Box id='right-top-box'>
          <Typography id ='and-title'>{and.andTitle}</Typography>
          <CountdownTimer publishedAt={and.publishedAt} andEndDate={and.andEndDate} />
          <hr style={{ margin: '20px auto', width: '70%' }}></hr>
          <Box id='like-and-button'>
            <Box id ='like-icon' onClick={handleClick}> 
            {isClicked ? <AiFillHeart id='heart-icon' size={"30"}/> : <AiOutlineHeart id='heart-icon' size={"30"}/>}
            </Box>
            <button id='go-and'>
              모임 참가하기
            </button>
            </Box>
          <button id='go-chat'>
            채팅방으로 이동하기
          </button>
          <Typography id ='go-member'>
            모임에 참여중인 멤버 보기
          </Typography>
        </Box>
        <Box id ='left-main-box'>
        <Typography id ='and-content'>{and.andContent}</Typography>
        <button onClick={() => updateAnd(and.andId)}>edit</button>
        <button onClick={() => deleteAnd(and.andId)}>delete</button>
        <br />
        <button onClick={() => applyAnd(and.andId)}>apply</button>
        <button onClick={() => applicantList(and.andId)}>apply List</button>
        <br />
        <button onClick={() => andChat(and.andId)}>CHAT</button>
        <br />
        </Box>
      </div>
      
    </div>
  );
};

export default AndDetail;
