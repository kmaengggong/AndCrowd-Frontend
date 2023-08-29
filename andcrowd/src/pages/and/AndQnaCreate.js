import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const AndQnaCreate = () => {
    const navigate = useNavigate();

    const params = useParams();
    const andId = params.andId;

    const [formData, setFormData] = useState({
        andId: andId,
        userId: "",
        andQnaTitle: "",
        andQnaContent: "",
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

        console.log("formdata:", formData); // 전달 값 확인

            const response = await fetch(`/and/${andId}/qna/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/qna/list`);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
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
