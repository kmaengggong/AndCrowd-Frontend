import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

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
                <div>
                    <input type="text" name="userId" value={userId} readOnly />
                    <input type="text" name="andQnaTitle" value={formData.andQnaTitle} onChange={handleInputChange} placeholder="제목" />
                    <input type="text" name="andQnaContent" value={formData.andQnaContent} onChange={handleInputChange} placeholder="내용" />
                </div>
                <div id="submit_btn">
                    <button type="submit">저장</button>
                </div>
            </form>
        </>
    );
};

export default AndQnaCreate;
