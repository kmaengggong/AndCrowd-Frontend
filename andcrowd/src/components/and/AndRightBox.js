import React,{ useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link, useNavigate,useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import '../../styles/and/AndDetail.css';
import { GetUserId } from '../user/GetUserId'; 


const AndComponent = ({ }) => {
  const navigate = useNavigate();

  const params = useParams();
  const andId = params.andId;

  const [and, setAnd] = useState({});
  const [isLiked, setIsLiked] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setUserId(GetUserId());
    fetchIsLiked();
    fetchData();
  }, [andId, isLiked]);

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

  const fetchIsLiked = async () => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/and/${andId}/like/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchLike = async () => {
    try {
      const response = await fetch(`/and/${andId}/like/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchIsLiked();
     } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }
  
  const handleClick = () => {
    fetchLike();
  };
  const andChat = (andId) => {
    navigate(`/and/${andId}/chat`);
  };

  const applyAnd = (andId) => {
    navigate(`/and/${andId}/applicant/create`);
  };

  const applicantList = (andId) => {
    navigate(`/and/${andId}/applicant/list`);
  };

  return (
    <Box id='right-top-box'>
      <Typography id='and-title'>{and.andTitle}</Typography>
      <CountdownTimer publishedAt={and.publishedAt} andEndDate={and.andEndDate} />
      <hr style={{ margin: '20px auto', width: '70%' }}></hr>
      <Box id='like-and-button'>
        <Box id='like-icon' onClick={handleClick}>
          {isLiked ? (
            <AiFillHeart id='heart-icon' size={'30'} />
          ) : (
            <AiOutlineHeart id='heart-icon' size={'30'} />
          )}
        </Box>
        <button id='go-and' onClick={() => applyAnd(and.andId)}>모임 참가하기</button>
      </Box>
      
      <button id='go-chat' onClick={() => andChat(and.andId)}>채팅방으로 이동하기</button>
      <Typography id ='go-member' onClick={() => applicantList(and.andId)}>모임에 참여중인 멤버 보기</Typography>
    </Box>
  );
};

export default AndComponent;
