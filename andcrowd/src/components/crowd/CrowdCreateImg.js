import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/and/AndCreatePage2.css';

const CrowdCreateImg = () => {
  const navigate = useNavigate(); 

  const params = useParams();
  const crowdId = params.crowdId;

  const [uploadFileUrl, setUploadFileUrl] = useState(""); // 이 부분 추가
  const [fileName, setFileName] = useState("");
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // 선택한 파일 가져오기  
    const formData = new FormData();
    formData.append("crowdId", crowdId); // crowdId 값을 추가
    formData.append("files", file); // 파일을 폼 데이터에 추가
    formData.append("fileType", "headerImg");
    if (file) {
      setFileName(file.name); // 파일 이름을 상태에 설정
    } else {
      setFileName(""); // 파일이 선택되지 않은 경우 상태를 초기화
    }
    try {
      const response = await fetch("/crowd/s3/uploads", {
        method: "POST",
        body: formData, // 폼 데이터를 전송합니다.
        headers: {
          ACL: "public-read", // ACL 헤더를 설정합니다.
        },
      });
  
      if (response.ok) {
        const fileReq = await response.json();
        const newUploadFileUrl = fileReq[0].uploadFileUrl; // 서버 응답에서 올바른 필드를 추출
        setUploadFileUrl(newUploadFileUrl); // 상태 업데이트
        console.log(newUploadFileUrl);
        // 성공적으로 업로드 및 처리되었을 때의 코드
        console.log("File uploaded successfully");

      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
    <div id='upload-img-boxx'>
        
        <div class="filebox">
        <input class="upload-name" value={fileName} placeholder="사진을 선택해주세요" disabled/>
        <label for="file">파일찾기</label> 
        <input type="file" id="file" accept="image/*"
        onChange={handleFileChange}/>
        </div>
        <div id='prv-box'>
        {uploadFileUrl && <img src={uploadFileUrl} alt="Uploaded Image" id='header-img-prv' />}
        </div>
      </div>
      
      
    </>
  );
};

export default CrowdCreateImg;
