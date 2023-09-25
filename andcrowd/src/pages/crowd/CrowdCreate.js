import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/crowd/CrowdCreate.css';
import { Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 
import CrowdEditor from "../../components/crowd/CrowdEditor";

const CrowdCreate = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동 함수를 가져옵니다.

  const [userId, setUserId] = useState("");
  const { crowdId } = useParams();
  const [formData, setFormData] = useState({
    crowdCategoryId: "",
    crowdTitle: "",
    crowdContent: "",
    crowdEndDate: "",
    crowdGoal: "",
    crowdHeaderImg: ""
  });

  const fetchData = async () => {
    setUserId(GetUserId());
      try {
        const response = await fetch(`/crowd/${crowdId}`);
        
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
      const response = await fetch(`/crowd/${crowdId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFormData, crowdContent: htmlStr, crowdStatus: 4 }),
      });
      navigate(`/crowd/${crowdId}/reward`);
      if (response.ok) {
        const responseData = await response.json();
        const crowdId = responseData;
        console.log("Created crowdId:", crowdId);
  
        navigate(`/crowd/${crowdId}`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" style={{ lineHeight: '2' }}>
        우리의 꿈과 열정을 함께 나누어주세요 🌟<br />
        여러분의 따뜻한 지원과 사랑으로 이 프로젝트를 실현하고자 합니다.<br />
        함께하는 모든 순간이 소중하고, 우리의 미래에 희망을 안겨줄 것입니다.<br />
        감사함과 함께, 함께하는 여정을 시작해봅시다!
      </Typography>
      <form onSubmit={handleNextButtonClick}>
        <div id='crowd-create-box'>
          <Typography id='crowd-title-text'>
            펀딩글의 제목을 적어주세요
          <span className='red-asterisk'>*</span>
          </Typography>
          <input
            type="text"
            name="crowdTitle"
            placeholder="제목 입력"
            id='create-crowd-title'
            
            onChange={handleInputChange}
          />
          <Typography id='crowd-title-text'>
            펀딩글의 내용을 적어주세요
          <span className='red-asterisk'>*</span>
          </Typography>
          <div>
          <CrowdEditor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></CrowdEditor>
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

export default CrowdCreate;
