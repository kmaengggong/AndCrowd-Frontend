import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AndApplicantCreate = () => {
    const params = useParams();
    const andId = params.andId;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        andId: andId,
        userId: "",
        andRoleId: "",
        andApplyContent: "",
    });

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

            const response = await fetch(`/and/${andId}/applicant/create`, {
                method: "POST",
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
    
export default AndApplicantCreate;