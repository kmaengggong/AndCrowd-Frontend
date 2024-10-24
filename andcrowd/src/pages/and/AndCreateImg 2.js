import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const AndCreateImg = () => {
  const navigate = useNavigate(); 

  const params = useParams();
  const andId = params.andId;


  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // 선택한 파일 가져오기  
    const formData = new FormData();
    formData.append("andId", andId); // andId 값을 추가
    formData.append("files", file); // 파일을 폼 데이터에 추가
    formData.append("fileType", "headerImg");
  
    try {
      const response = await fetch("/and/s3/uploads", {
        method: "POST",
        body: formData, // 폼 데이터를 전송합니다.
        headers: {
          ACL: "public-read", // ACL 헤더를 설정합니다.
        },
      });
  
      if (response.ok) {
        // 성공적으로 업로드 및 처리되었을 때의 코드
        console.log("File uploaded successfully");
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  


  // "다음" 버튼 클릭 시 실행될 함수
  const handleNextButtonClick = async () => {

        navigate(`/and/${andId}/role/create`);
  };

  return (
    <>
        <input
                type="file"
                name="andHeaderImg"
                accept="image/*"
                onChange={handleFileChange} // 파일 선택 시 handleFileChange 함수 호출
            />
        <button type="button" onClick={handleNextButtonClick}>
        다음
        </button>
    </>
  );
};

export default AndCreateImg;
