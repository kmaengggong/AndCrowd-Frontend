import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AndApplicantUpdate = () => {
    const params = useParams();
    const andId = params.andId;
    const andApplyId = params.andApplyId;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        andId: andId,
        userId: "",
        andRoleId: "",
        andApplyContent: "",
        andApplyStatus: "",
    });

    useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          const response = await fetch(`/and/${andId}/applicant/${andApplyId}`);
          
          if (response.ok) {
            const data = await response.json();
            setFormData(data);
          } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
    
        } catch (error) {
          console.error("Error fetching And Qna data:", error);
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

        console.log("formdata:", formData);

            const response = await fetch(`/and/${andId}/applicant/${andApplyId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/applicant/list`);
    };

    

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
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
    
export default AndApplicantUpdate;