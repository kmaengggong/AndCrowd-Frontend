import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndBoardCreate = () => {
    const navigate = useNavigate();
    const params = useParams();
    const andId = params.andId;

    const [formData, setFormData] = useState({
        andId: andId,
        userId: "",
        andBoardTitle: "",
        andBoardContent: "",
        andImg: "",
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
    
        console.log("formData:", formData); // 전달 값 확인
    
        const response = await fetch(`/and/${andId}/board/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
    
        navigate(`/and/${andId}/board/list`);
      };

    return (
        <>
            <h1>Create AndBoard</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
                    <input type="text" name="andBoardTitle" value={formData.andBoardTitle} onChange={handleInputChange} placeholder="제목" />
                    <input type="text" name="andBoardContent" value={formData.andBoardContent} onChange={handleInputChange} placeholder="내용"></input>
                    <input type="text" name="andImg" value={formData.andImg} onChange={handleInputChange} placeholder="대표 이미지" />
                </div>
                <div id="submit_btn">
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => navigate(`/and/${andId}/board/list`)}>취소</button>
                </div>
            </form>
        </>
    );
};

export default AndBoardCreate;
