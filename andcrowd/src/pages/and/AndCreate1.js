import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../styles/and/AndCreate.css';
import { Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 

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
  const [userCrowd, setUserCrowd] = useState([]);
  const [crowdId, setCrowdId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    setUserId(GetUserId());
    fetchUserCrowdData();
  }, []);

  const updatedFormData = {
    ...formData,
    userId: userId,
    crowdId: crowdId,
  };  
  
  const handleNextButtonClick = async () => {
    if (isButtonDisabled) {
    return;
    }
    try {
      setIsButtonDisabled(true);

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
    }finally {
      setIsButtonDisabled(false); 
    }
  };
  
  const fetchUserCrowdData = async () => {
    try{
      const userId = GetUserId();
      console.log(`/user/${userId}/maker/1`);
      const response = await fetch(`/user/${userId}/maker/1`);
      if (response.ok) {
        const data = await response.json();
        console.log('fetchUserCrowdData: ',data);
        setUserCrowd(data);
      } else {
        throw new Error(`Fetching data failed with status ${response.status}.`);
      }

    }
    catch (error) {
      console.error("Error fetching data:", error);
    }

  }  

  const handleCrowdId = (event) => {
    const { name, value } = event.target;
    setCrowdId(Number(value));
  }
  

  return (
    <div>
    {/* <Typography>모임글 작성할거면 이거읽고 버튼을 누르세요</Typography> */}
      <Typography>연결된 펀딩이 있으면 아래에 옵션에서 선택해주세요</Typography>
      {/* <input id='crowd-link-input'
            type="text"
            name="andLink"
            value={formData.andLink}
            placeholder="링크 입력"
          /> */}
      <div >
        <div>
          <select
            name='userCrowd'
            value={crowdId}
            onChange={handleCrowdId}
          >
            <option value="">없음</option>
            {userCrowd.map((crowd) => (
              <option value={crowd.projectId}>[{crowd.projectId}] {crowd.projectTitle}</option>
            ))}
          </select>

        </div>
        
        <button id='first-submit-btn' type="button" onClick={handleNextButtonClick}>
          다음
        </button>
      </div>
      
    </div>
  );
};

export default AndCreate1;
