import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Editor from "../../components/and/Editor";
import '../../styles/and/AndCreatePage2.css';
import AndCreateImg from "../../components/and/AndCreateImg";
import { Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 

const AndCreatePage2 = () => {

  const navigate = useNavigate();
  const params = useParams(); // useParams()를 사용하여 URL 파라미터를 가져옵니다.
  const { andId } = params; // andId를 가져옵니다.
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    andCategoryId: "",
    andTitle: "",
    andContent: "",
    needNumMem: "",
    andEndDate: "",
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
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }

    setUserId(GetUserId());
   
  
    try {
      const response = await fetch(`/and/${andId}`);
      if (response.ok) {
        const data = await response.json();
        // 초기 formData를 비우고 새로운 데이터로 업데이트
        setFormData({
          userId: "",
          andCategoryId: "",
          andTitle: "",
          andContent: "",
          needNumMem: "",
          andEndDate: "",
          andHeaderImg: ""
        });
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

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleDateChange = (event) => {
    const { name, value } = event.target;
  
    // 입력된 날짜 문자열을 Date 객체로 변환
    const date = new Date(value);

    // Date 객체의 시간 부분을 "00:00:00.000000"으로 설정
    date.setHours(0, 0, 0, 0);
  
    // Date 객체를 datetime-local 형식으로 변환
    const formattedDate = `${date.toISOString().slice(0, 16)}`;
  
    setFormData({
      ...formData,
      [name]: formattedDate,
    });
  };
  
  const updatedFormData = {
    ...formData,
  };

  const handleNextButtonClick = async () => {
    try {
      const response = await fetch(`/and/${andId}/create`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          andTitle: "더미 타이틀",
          andContent: "더미 컨텐츠",
          needNumMem: 999,
          ...updatedFormData,
        }),
      });
      navigate(`/and/${andId}/create/editer`);
      if (response.ok) {
        const responseData = await response.json();
        const andId = responseData;
        navigate(`/and/${andId}/create/editer`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div id='and-create2-container'>
      <form  id='and-create-form' onSubmit={handleNextButtonClick}>
        <div id='and-create2-box'>
            <Typography id='and-kind-text'>어떤 종류의 모임인가요?</Typography>
            <select
              name="andCategoryId"
              value={formData.andCategoryId}
              onChange={handleCategoryChange}
              id = 'and-create-category'
              required
            >
              <option value="0">카테고리 선택</option>
              <option value="1">문화 예술</option>
              <option value="2">액티비티 스포츠</option>
              <option value="3">테크 가전</option>
              <option value="4">푸드</option>
              <option value="5">언어</option>
              <option value="6">여행</option>
              <option value="7">반려동물</option>
              <option value="8">기타</option>
            </select>
            <Typography id='and-date-text'>언제까지 모집할 계획인가요?</Typography>
            <div id='and-create2-mid'>
              <input id = 'and-create-date' type="date" name="andEndDate"  onChange={handleDateChange} placeholder="마감일"  required/>
            </div>
            {/*<Typography id='and-num-text'>몇명을 모집할까요?</Typography>
            <input id='and-create-need-num' type="number" name="needNumMem" value={formData.needNumMem} onChange={handleInputChange} placeholder="모집인원" />
            */}
            <Typography id='and-date-text'>대표사진을 첨부해 주세요</Typography>
            <AndCreateImg />
        </div>
        <div id="submit-btn-div">
          {/* <button type="submit">저장</button> */}
          <button id='submit-btn' type="button" onClick={handleNextButtonClick}>
            다음
          </button>
        </div>
      </form>
    </div>
  );
};
export default AndCreatePage2;