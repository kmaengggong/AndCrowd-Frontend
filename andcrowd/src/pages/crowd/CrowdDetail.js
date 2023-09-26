import React, { useState, useEffect } from "react";
import {  useParams } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import CrowdToolbar from "../../components/crowd/CrowdToolBar";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../../styles/crowd/CrowdDetail.css';
import CrowdRightBox from "../../components/crowd/CrowdRightBox.js"
import { GetUserId } from "../../components/user/GetUserId";
import { useIsLoginState } from "../../context/isLoginContext";

const CrowdDetail = () => {
  const isLogin = useIsLoginState();
  const params = useParams();
  const crowdId = params.crowdId;

  const navigate = useNavigate();
  const [crowd, setCrowd] = useState({});
  const [userId, setUserId] = useState(null); // 현재 로그인 중인 사용자 id
  const [crowdUserId, setCrowdUserId] = useState(null);

  useEffect(() => {
    setUserId(GetUserId());
  }, []);

  useEffect(() => {
    fetchData();
  }, [crowdId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCrowd(data);
        setCrowdUserId(data.userId);
        // 게시물 조회 이력 확인
        const viewedPosts = localStorage.getItem("viewedPosts") || "";
        if (!viewedPosts.includes(`[${crowdId}]`)) {
          // 중복 조회를 방지하기 위해 조회수 증가 요청
          await axios.put(`/crowd/${crowdId}/updateView`);
          // 조회한 게시물 ID를 이력에 추가
          localStorage.setItem("viewedPosts", viewedPosts + `[${crowdId}]`);
        }
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
      navigate("/NotFound");
    }

  };

  const updateCrowd = (crowdId) => {
    navigate(`/crowd/${crowdId}/update`);
  };

  const deleteCrowd = async (crowdId) => {
    const isConfirmed = window.confirm("정말로 펀딩글을 삭제하시겠습니까?");

    if(isConfirmed){
      try {
        await axios.delete(`/crowd/${crowdId}/delete`);
        console.log("Deleted and with ID:", crowdId);
        navigate(`/crowd/list`);
      } catch (error) {
        console.error("error in deleting crowd:", error);
      }
    }
  };

  const manageCrowd = (crowdId) => {
    navigate(`/crowd/${crowdId}/manage`);
  };

  return (
    <div>
      <CrowdToolbar crowdId={crowd.crowdId} />
      <div id ='crowd-detail-container'> 
        <Box id ='left-main-box'>
          <img id='crowd-header-img' src={crowd.headerImg} alt="Header Image" />
          <hr></hr>
          <div id='crowd-content-div' dangerouslySetInnerHTML={{ __html :  crowd.crowdContent  }} style={{ maxWidth: '100%', overflowX: 'auto',overflowY: 'auto' }}/>
          {/* 모임장만 볼 수 있는 버튼 */}
          {userId === crowdUserId && (
            <>
              <div id='crowd-detail-bottom'>
                <Typography id='crowd-detail-upde'
                  onClick={() => updateCrowd(crowdId, crowdId)}
                >
                  수정
                </Typography>
                <Typography id='crowd-detail-upde'
                  onClick={() => deleteCrowd(crowdId, crowdId)}
                >
                  삭제
                </Typography>
              </div>
              <div id='crowd-detail-bottom2'>
                {/* -- 모임 관리 안에 신청서 목록 있음 --
                <Typography id='and-detail-2'
                onClick={() => applicantList(and.andId)}
                >
                  신청서 목록
                </Typography> */}
                <Typography id='crowd-detail-2'
                  onClick={() => manageCrowd(crowd.crowdId)}
                >
                  펀딩 관리                           
                </Typography> 
              </div>
            </>
          )}
          <br />
        </Box>
        <CrowdRightBox/>
      </div>
      
    </div>
  );
};

export default CrowdDetail;
