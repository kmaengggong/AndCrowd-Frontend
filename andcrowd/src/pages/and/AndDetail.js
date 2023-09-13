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
import AndRightBox from "../../components/and/AndRightBox"

const AndDetail = () => {
  const params = useParams();
  const andId = params.andId;

  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
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

  const updateAnd = (andId) => {
    navigate(`/and/${andId}/update`);
  };

  const deleteAnd = async (andId) => {
    try {
      await axios.delete(`/and/${andId}/delete`);
      console.log("Deleted and with ID:", andId);
      navigate(`/and/scroll`);
    } catch (error) {
      console.error("error in deleting and:", error);
    }
  };

  const manageAnd = (andId) => {
    navigate(`/and/${andId}/manage`);
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
      <div id ='and-detail-container'> 
        <Box id ='left-main-box'>
          <div id='and-content-div' dangerouslySetInnerHTML={{ __html :  and.andContent  }} style={{ maxWidth: '100%', overflowX: 'auto' }}/>
        <Typography id ='and-content'></Typography>
        <button onClick={() => updateAnd(and.andId)}>edit</button>  
        <button onClick={() => deleteAnd(and.andId)}>delete</button>
        <br />
        <button onClick={() => applicantList(and.andId)}>apply List</button>
        <br />
        <button onClick={() => manageAnd(and.andId)}>모임 관리</button>
        <hr />
        <br />
        </Box>
        <AndRightBox/>
      </div>
      
    </div>
  );
};

export default AndDetail;
