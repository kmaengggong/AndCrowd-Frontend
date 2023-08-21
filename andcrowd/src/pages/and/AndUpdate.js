import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AndUpdate = () => {
  const params = useParams();
  const andId = params.andId;

  const [formData, setFormData] = useState({
    userId: "",
    andCategoryId: "",
    andTitle: "",
    andContent: "",
    andEndDate: "",
    needNumMem: "",
    andHeaderImg: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("formdata:", formData); // 전달 값 확인


    try {
      const response = await fetch(`/and/${andId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 성공적으로 데이터 전송 및 처리되었을 때의 코드
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
          <input type="text" name="andCategoryId" value={formData.andCategoryId} onChange={handleInputChange} placeholder="카테고리" />
          <input type="text" name="andTitle" value={formData.andTitle} onChange={handleInputChange} placeholder="제목" />
          <input type="text" name="andContent" value={formData.andContent} onChange={handleInputChange} placeholder="내용" />
          <input type="datetime-local" name="andEndDate" value={formData.andEndDate} onChange={handleInputChange} placeholder="마감일" />
          <input type="text" name="needNumMem" value={formData.needNumMem} onChange={handleInputChange} placeholder="모집인원" />
          <input type="text" name="andHeaderImg" value={formData.andHeaderImg} onChange={handleInputChange} placeholder="대표 이미지" />
        </div>
        <div id="submit_btn">
          <button type="submit">저장</button>
          <button type="">다음</button>
        </div>
      </form>
    </>
  );
}

export default AndUpdate;
