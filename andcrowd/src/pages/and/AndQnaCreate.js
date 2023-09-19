import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import '../../styles/and/AndQnaCreate.css';
import Editor from "../../components/and/Editor";
import { GetUserId } from "../../components/user/GetUserId";

const AndQnaCreate = () => {
    const navigate = useNavigate();

    const params = useParams();
    const andId = params.andId;

    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        andId: andId,
        andQnaTitle: "",
        andQnaContent: "",
    });
    // const yourAccessToken = Cookies.get('refresh_token');

    // const fetchData = async () => {
    //   try {
    //     const userIdResponse = await fetch(`/user-info/userid`,{
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${yourAccessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     if (userIdResponse.ok) {
    //       const userId = await userIdResponse.json();
    //       setUserId(userId.userId);
    //     } else {
    //       throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
    //     }
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    // };
  
    useEffect(() => {
      setUserId(GetUserId());
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
        andQnaContent:htmlStr
      };  
      
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("formdata:", formData); // 전달 값 확인

            const response = await fetch(`/and/${andId}/qna/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            navigate(`/and/${andId}/qna/list`);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
            <div id="qna-submit_btn">
                    <button id='board-can-btn' type="button" onClick={() => navigate(`/and/${andId}/qna/list`)}>취소</button>
                    <button id='board-save-btn' type="submit">저장</button>
                </div>
                <div>
                    <input id='qna-input' type="text" name="userId" value={userId} readOnly />
                    <input id='qna-input' type="text" name="andQnaTitle" value={formData.andQnaTitle} onChange={handleInputChange} placeholder="제목" />
                    <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor>
                </div>
                
            </form>
        </>
    );
};

export default AndQnaCreate;
