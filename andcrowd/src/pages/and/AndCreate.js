import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Editor from "../../components/and/Editor";
import '../../styles/and/AndCreate.css';
import { Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 

const AndCreate = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동 함수를 가져옵니다.

  const [userId, setUserId] = useState("");
  const { andId } = useParams();
  const [formData, setFormData] = useState({
    andCategoryId: "",
    andTitle: "",
    andContent: "",
    andEndDate: "",
    needNumMem: "",
    andHeaderImg: ""
  });

  // const yourAccessToken = Cookies.get('refresh_token');

  const fetchData = async () => {
    // try {
    //   const userIdResponse = await fetch(`/user-info/userid`,{
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${yourAccessToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (userIdResponse.ok) {
    //     const userId = await userIdResponse.json();
    //     setUserId(userId.userId);
    //   } else {
    //     throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
    //   }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    setUserId(GetUserId());
      try {
        const response = await fetch(`/and/${andId}`);
        
        if (response.ok) {
          const data = await response.json();
          setFormData(data); // 기존 데이터를 모두 할당
        } else {
          throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
  
      } catch (error) {
        console.error("Error fetching And data:", error);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [htmlStr, setHtmlStr] = React.useState('');

  const updatedFormData = {
    ...formData,
    userId: userId,
  };  


  // "다음" 버튼 클릭 시 실행될 함수
  const handleNextButtonClick = async () => {
    try {
      const response = await fetch(`/and/${andId}/create`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFormData, andContent: htmlStr, andStatus: 4 }),
      });
      navigate(`/and/${andId}/role/create`);
      if (response.ok) {
        const responseData = await response.json();
        const andId = responseData;
        console.log("Created andId:", andId);
  
        navigate(`/and/${andId}`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  

  return (
    <>
      <form onSubmit={handleNextButtonClick}>
        <div id='and-create-box'>
          <Typography id='and-title-text'>
            모임글의 제목을 적어주세요
          <span className='red-asterisk'>*</span>
          </Typography>
          <input
            type="text"
            name="andTitle"
            placeholder="제목 입력"
            id='create-and-title'
            
            onChange={handleInputChange}
          />
          <Typography id='and-title-text'>
            모임글의 내용을 적어주세요
          <span className='red-asterisk'>*</span>
          </Typography>
          <div>
          <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor>
          </div>
        </div>
        
        <div id="submit_btn">
          <button id='next-button' type="button" onClick={handleNextButtonClick}>
            다음
          </button>
        </div>
      </form>
    </>
  );
};

export default AndCreate;
