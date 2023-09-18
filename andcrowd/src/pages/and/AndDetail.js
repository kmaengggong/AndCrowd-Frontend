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
import { GetUserId } from "../../components/user/GetUserId";

const AndDetail = () => {
  const params = useParams();
  const andId = params.andId;

  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [and, setAnd] = useState({});
  const [userId, setUserId] = useState(null); // 현재 로그인 중인 사용자 id
  const [andUserId, setAndUserId] = useState(null); // 모임글을 작성한 사용자 id

  useEffect(() => {
    setUserId(GetUserId());
  }, []);

  useEffect(() => {
    fetchData();
  }, [andId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnd(data);
        setAndUserId(data.userId);
        // 게시물 조회 이력 확인
        const viewedPosts = localStorage.getItem("viewedPosts") || "";
        if (!viewedPosts.includes(`[${andId}]`)) {
          // 중복 조회를 방지하기 위해 조회수 증가 요청
          await axios.put(`/and/${andId}/updateView`);
          // 조회한 게시물 ID를 이력에 추가
          localStorage.setItem("viewedPosts", viewedPosts + `[${andId}]`);
        }
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
          <img id='and-header-img' src={and.andHeaderImg} alt="Header Image" />
          <hr></hr>
          <div id='and-content-div' dangerouslySetInnerHTML={{ __html :  and.andContent  }} style={{ maxWidth: '100%', overflowX: 'auto',overflowY: 'auto' }}/>
          <Typography id ='and-content'></Typography>
          {/* 모임장만 볼 수 있는 버튼 */}
          {userId === andUserId && (
            <>
              <div id='and-detail-bottom'>
                <Typography id='and-detail-upde'
                  onClick={() => updateAnd(andId, andId)}
                >
                  수정
                </Typography>
                <Typography id='and-detail-upde'
                  onClick={() => deleteAnd(andId, andId)}
                >
                  삭제
                </Typography>
              </div>
              <div id='and-detail-bottom2'>
                {/* -- 모임 관리 안에 신청서 목록 있음 --
                <Typography id='and-detail-2'
                onClick={() => applicantList(and.andId)}
                >
                  신청서 목록
                </Typography> */}
                <Typography id='and-detail-2'
                  onClick={() => manageAnd(and.andId)}
                >
                  모임 관리                           
                </Typography> 
              </div>
            </>
          )}
          <br />
        </Box>
        <AndRightBox/>
      </div>
      
    </div>
  );
};

export default AndDetail;
