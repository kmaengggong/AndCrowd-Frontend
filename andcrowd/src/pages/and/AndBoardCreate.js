import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import '../../styles/and/AndBoardCreate.css'
import Editor from "../../components/and/Editor";

const AndBoardCreate = () => {
    const navigate = useNavigate();
    const params = useParams();
    const andId = params.andId;

    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        andId: andId,
        andBoardTitle: "",
        andBoardContent: "",
        andImg: "",
    });
    const [htmlStr, setHtmlStr] = React.useState('');
    const yourAccessToken = Cookies.get('refresh_token');

    const fetchData = async () => {
      try {
        const userIdResponse = await fetch(`/user-info/userid`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${yourAccessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (userIdResponse.ok) {
          const userId = await userIdResponse.json();
          setUserId(userId.userId);
        } else {
          throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
        }
        } catch (error) {
          console.error("Error fetching data:", error);
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

    const updatedFormData = {
      ...formData,
      userId: userId,
      andBoardContent: htmlStr
    };  

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        console.log("formData:", formData); // 전달 값 확인
    
        const response = await fetch(`/and/${andId}/board/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...updatedFormData}),
        });
    
        navigate(`/and/${andId}/board/list`);
      };

    return (
        <>
            <form id='andBoard-form' onSubmit={handleSubmit}>
                <div id="andboard-submit_btn">
                    <button id='board-can-btn' type="button" onClick={() => navigate(`/and/${andId}/board/list`)}>취소</button>
                    <button id='board-save-btn' type="submit">저장</button>
                </div>
                <div>
                    <input id='andBoard-input' type="text" name="userId" value={userId} readOnly />
                    <select
              name="andBoardTag"
              value={formData.andBoardTag}
              onChange={handleInputChange}
              id = 'andBoard-input2'
              required
            >
              <option value="">글 유형 선택</option>
              <option value="0">공지사항</option>
              <option value="1">소식</option>
            </select>
                    
                    {/*<input id='andBoard-input' type="text" name="andImg" value={formData.andImg} onChange={handleInputChange} placeholder="대표 이미지" />*/}
                    <input id='andBoard-input' type="text" name="andBoardTitle" value={formData.andBoardTitle} onChange={handleInputChange} placeholder="제목" />
                    <div id='editdiv'><Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor></div>
                </div>
            </form>
        </>
    );
};

export default AndBoardCreate;
