import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const AndApplicantCreate = () => {
    const params = useParams();
    const andId = params.andId;

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        andId: andId,
        andRoleId: "",
        andApplyContent: "",
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

        console.log("formdata:", formData);

            const response = await fetch(`/and/${andId}/applicant/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            navigate(`/and/${andId}/applicant/list`);
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={userId} readOnly />
                    <input type="text" name="andRoleId" value={formData.andRoleId} onChange={handleInputChange} placeholder="역할 번호" />
                    <input type="text" name="andApplyContent" value={formData.andApplyContent} onChange={handleInputChange} placeholder="내용" />
                </div>
                <div id="submit_btn">
                    <button type="submit">저장</button>
                </div>
            </form>

        </>
    );
};
    
export default AndApplicantCreate;