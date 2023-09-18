import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CrowdReplyCreate = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdQnaId = params.crowdQnaId;

    const [userId, setUserId] = useState("");
    const [createdQnaReplyId, setCreatedQnaReplyId] = useState(null);

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        userId: "",
        crowdQnaId: crowdQnaId,
        qnaReplyContent: "",
    });

    const userAccessToken = Cookies.get('refresh_token');

    const fetchData = async () => {
        try{
            const userIdResponse = await fetch(`user-info/userid`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if(userIdResponse.ok){
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
    },[]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const updatedFormData = {
        ...formData,
        userId: userId,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formdata:",formData);
        const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
        });
        if (response.ok) {
            const createdData = await response.json();
            setCreatedQnaReplyId(createdData.qnaReplyId); // 생성된 QnaReply의 ID를 설정
            console.log("생성된 crowdQnaId:", createdQnaReplyId);
            navigate(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    회원번호: <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" readOnly/> <br/>
                    <input type="text" name="qnaReplyContent" value={formData.qnaReplyContent} onChange={handleInputChange} placeholder="댓글을 입력하세요" />
                </div>
                <div id="submitBtn">
                    <button type="submit">저장</button>
                </div>
            </form>
            <button></button>
        </div>
    )
}

export default CrowdReplyCreate;