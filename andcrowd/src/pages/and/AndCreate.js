import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const AndCreate = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동 함수를 가져옵니다.

  const [formData, setFormData] = useState({
    userId: "",
    andCategoryId: "",
    andTitle: "",
    andContent: "",
    andEndDate: "",
    needNumMem: "",
    andHeaderImg: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // "다음" 버튼 클릭 시 실행될 함수
  const handleNextButtonClick = async () => {
    try {
      const response = await fetch("/and/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const andId = responseData; // 응답 데이터에서 andId 값을 추출
        console.log("Created andId:", andId);

        navigate(`/and/${andId}/img/create`);
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
        <div>
                <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
                <input type="text" name="andCategoryId" value={formData.andCategoryId} onChange={handleInputChange} placeholder="카테고리" />
                <input type="text" name="andTitle" value={formData.andTitle} onChange={handleInputChange} placeholder="제목" />
                <input type="text" name="andContent" value={formData.andContent} onChange={handleInputChange} placeholder="내용" />
                <input type="datetime-local" name="andEndDate" value={formData.andEndDate} onChange={handleInputChange} placeholder="마감일" />
                <input type="text" name="needNumMem" value={formData.needNumMem} onChange={handleInputChange} placeholder="모집인원" />
        </div>
        <div id="submit_btn">
          {/* <button type="submit">저장</button> */}
          <button type="button" onClick={handleNextButtonClick}>
            다음
          </button>
        </div>
      </form>
    </>
  );
};

export default AndCreate;
