import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../styles/and/AndCreate.css';
import { Typography } from "@mui/material";

const AndCreate1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    andCategoryId: "",
    andTitle: "",
    andContent: "",
    andEndDate: "",
    needNumMem: "",
    andHeaderImg: ""
  });
  const [userId, setUserId] = useState("");
  const yourAccessToken = Cookies.get('refresh_token');
  useEffect(() => {
    fetchData();
  }, []);
  const updatedFormData = {
    ...formData,
    userId: userId,
  };  
  const fetchData = async () => {
    try {
      const userIdResponse = await fetch(`/user-info/userid`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${yourAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (userIdResponse.ok) {
        const userId = await userIdResponse.json();
        setUserId(userId.userId);
      } else {
        throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
      }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  };
  const handleNextButtonClick = async () => {
    try {
      const response = await fetch("/and/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...updatedFormData,
          andContent: "Temporary Content",
          andHeaderImg: "noImg",
          andTitle: "Temporary Title",
          andCategoryId: 999,
          andEndDate: "2099-12-12T12:00:00",
          needNumMem: 999,
          andStatus: 4,
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const andId = responseData;
        console.log("Created andId:", andId);
        navigate(`/and/${andId}/create`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  
  
  

  return (
    <>
    <Typography>모임글 작성할거면 이거읽고 버튼을 누르세요</Typography>
      <Typography>연결된 펀딩 링크가 있으면 아래에 붙여넣어주세요</Typography>
      <input id='crowd-link-input'
            type="text"
            name="andLink"
            value={formData.andLink}
            placeholder="링크 입력"
          />
      <div >
      <button id='first-submit-btn' type="button" onClick={handleNextButtonClick}>
          확인했습니다
        </button>
        
      </div>
      
    </>
  );
};

export default AndCreate1;
