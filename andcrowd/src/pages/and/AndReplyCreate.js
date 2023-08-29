import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const AndReplyCreate = () => {
    const navigate = useNavigate();

    const params = useParams();
    const andId = params.andId;
    const andQnaId = params.andQnaId;

    const [formData, setFormData] = useState({
        andId: andId,
        userId: "",
        andQnaId: andQnaId,
        andReplyContent: "",
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

            const response = await fetch(`/and/${andId}/qna/reply/${andQnaId}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/qna/${andQnaId}`);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
                    <input type="text" name="andReplyContent" value={formData.andReplyContent} onChange={handleInputChange} placeholder="내용" />
                </div>
                <div id="submit_btn">
                    <button type="submit">저장</button>
                </div>
            </form>
        </>
    );
};

export default AndReplyCreate;
