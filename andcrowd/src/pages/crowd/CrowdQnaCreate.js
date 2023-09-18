import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";

const CrowdQnaCreate = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        qnaTitle: "",
        qnaContent: "",
    });

    const userAccessToken = Cookies.get('refresh_token');

    const fetchData = async () => {
        try {
            const userIdResponse = await fetch(`/user-info/userid`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formdata: ", formData);
        const response = await fetch(`/crowd/${crowdId}/qna`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
        });
        navigate(`/crowd/${crowdId}/qna/all`);
    };

    return(
        <div>
            <CrowdToolBar crowdId={crowdId} />
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={userId} readOnly />
                    <input type="text" name="qnaTitle" value={formData.qnaTitle} onChange={handleInputChange} placeholder="제목" />
                    <input type="text" name="qnaContent" value={formData.qnaContent} onChange={handleInputChange} placeholder="본문" />
                </div>
                <div>
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => navigate(`/crowd/${crowdId}/qna/all`)}>업로드 취소</button>
                </div>
            </form>
        </div>
    )
}

export default CrowdQnaCreate;