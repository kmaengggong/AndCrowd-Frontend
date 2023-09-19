import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../../components/and/Editor";
import '../../styles/and/AndUpdate.css';

const AndUpdate = () => {
  const [htmlStr, setHtmlStr] = React.useState('');
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
        setFormData(data);
        setHtmlStr(data.andContent); // andContent 값을 htmlStr 상태에 설정합니다.
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

  return (
    <>
      <div id="and-update-submit_btn-box">
          <button id='and-update-submit_btn' type="submit" onClick={handleSubmit}>저장</button>
          <button id='and-update-submit_btn2' type="" onClick={handleSubmit2}>다음</button>
        </div>
      <form id='and-update-form' onSubmit={handleSubmit}>
        <div>
          <input id='and-update-input' type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
          <input id='and-update-input' type="text" name="andCategoryId" value={formData.andCategoryId} onChange={handleInputChange} placeholder="카테고리" />
          <input id='and-update-input' type="text" name="andTitle" value={formData.andTitle} onChange={handleInputChange} placeholder="제목" />
          <input id='and-update-input' type="datetime-local" name="andEndDate"  onChange={handleInputChange} placeholder="마감일" />
          <input id='and-update-input' type="text" name="needNumMem" value={formData.needNumMem} onChange={handleInputChange} placeholder="모집인원" />
          <input id='and-update-input' type="text" name="andHeaderImg" value={formData.andHeaderImg} onChange={handleInputChange} placeholder="대표 이미지" />
          <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor>
        </div>
        
      </form>
    </>
  );
};

export default AndUpdate;
