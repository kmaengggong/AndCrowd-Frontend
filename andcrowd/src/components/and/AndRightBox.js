import React,{ useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link, useNavigate,useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import '../../styles/and/AndDetail.css';
const AndComponent = ({ }) => {
    const params = useParams();
  const andId = params.andId;

  const navigate = useNavigate();
  const [and, setAnd] = useState({});
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
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Box id='right-top-box'>
      <Typography id='and-title'>{and.andTitle}</Typography>
      <CountdownTimer publishedAt={and.publishedAt} andEndDate={and.andEndDate} />
      <hr style={{ margin: '20px auto', width: '70%' }}></hr>
      <Box id='like-and-button'>
        <Box id='like-icon' onClick={handleClick}>
          {isClicked ? (
            <AiFillHeart id='heart-icon' size={'30'} />
          ) : (
            <AiOutlineHeart id='heart-icon' size={'30'} />
          )}
        </Box>
        <button id='go-and'>모임 참가하기</button>
      </Box>
      
      <button id='go-chat'>채팅방으로 이동하기</button>
      <Typography id ='go-member'>모임에 참여중인 멤버 보기</Typography>
    </Box>
  );
};

export default AndComponent;
