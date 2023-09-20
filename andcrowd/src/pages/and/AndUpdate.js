import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../../components/and/Editor";
import '../../styles/and/AndUpdate.css';

const AndUpdate = () => {
  const [htmlStr, setHtmlStr] = React.useState('');
  const params = useParams();
  const andId = params.andId;

  const [andEndDateOnly, setAndEndDateOnly] = useState(new Date());
  const [formData, setFormData] = useState({
    userId: "",
    andCategoryId: "",
    andTitle: "",
    andContent: "",
    andEndDate: "",
    needNumMem: "",
    andHeaderImg: "",
  });
  const [headerImg, setHeaderImg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('fetchData: ', data);
        setFormData(data);
        setHeaderImg(data.andHeaderImg);
        setHtmlStr(data.andContent); // andContent 값을 htmlStr 상태에 설정합니다.
        setAndEndDateOnly(new Date(data.andEndDate));
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

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log("formdata:", formData);

    try {
      const response = await fetch(`/and/${andId}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData,andContent: htmlStr}), // formData 전체를 전송합니다.
      });

      if (response.ok) {
        navigate(`/and/${andId}`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  const handleSubmit2 = async (event) => {
    event.preventDefault();
    
    console.log("formdata:", formData);

    try {
      const response = await fetch(`/and/${andId}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData,andContent: htmlStr}), // formData 전체를 전송합니다.
      });

      if (response.ok) {
        navigate(`/and/${andId}/role/update`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

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
    setAndEndDateOnly(date);

    // Date 객체의 시간 부분을 "00:00:00.000000"으로 설정
    date.setUTCHours(0, 0, 0, 0);
  
    // Date 객체를 datetime-local 형식으로 변환
    const formattedDate = date.toISOString().slice(0, 16);
  
    setFormData({
      ...formData,
      [name]: formattedDate,
    });
  };

  const [fileName, setFileName] = useState("");
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // 선택한 파일 가져오기  
    const formData = new FormData();
    formData.append("andId", andId); // andId 값을 추가
    formData.append("files", file); // 파일을 폼 데이터에 추가
    formData.append("fileType", "headerImg");
    if (file) {
      setFileName(file.name); // 파일 이름을 상태에 설정
    } else {
      setFileName(""); // 파일이 선택되지 않은 경우 상태를 초기화
    }
    try {
      const response = await fetch("/and/s3/uploads", {
        method: "POST",
        body: formData, // 폼 데이터를 전송합니다.
        headers: {
          ACL: "public-read", // ACL 헤더를 설정합니다.
        },
      });
  
      if (response.ok) {
        const fileReq = await response.json();
        const newUploadFileUrl = fileReq[0].uploadFileUrl; // 서버 응답에서 올바른 필드를 추출
        setHeaderImg(newUploadFileUrl);
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
      <div id="and-update-submit_btn-box">
          <button id='and-update-submit_btn' type="submit" onClick={handleSubmit}>저장</button>
          <button id='and-update-submit_btn2' type="" onClick={handleSubmit2}>다음</button>
        </div>
      <form id='and-update-form' onSubmit={handleSubmit}>
        <div>
          {/* <input id='and-update-input' type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" /> */}
          {/* <input id='and-update-input' type="text" name="andCategoryId" value={formData.andCategoryId} onChange={handleInputChange} placeholder="카테고리" /> */}
          카테고리: 
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

          <input id='and-update-input' type="text" name="andTitle" value={formData.andTitle} onChange={handleInputChange} placeholder="제목" />
          <input id='and-update-input' type="date" name="andEndDate" value={andEndDateOnly.toISOString().split('T')[0]}  onChange={handleDateChange} placeholder="마감일" />
          {/* <input id='and-update-input' type="text" name="needNumMem" value={formData.needNumMem} onChange={handleInputChange} placeholder="모집인원" /> */}
          {/* <input id='and-update-input' type="text" name="andHeaderImg" value={formData.andHeaderImg} onChange={handleInputChange} placeholder="대표 이미지" /> */}
          <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor>
          <input type="file" id="file" accept="image/*" onChange={handleFileChange}/>
            {headerImg && <img id="andupdate-img" src={headerImg} alt="Uploaded Image" />}
        </div>
        
      </form>
    </>
  );
};

export default AndUpdate;
