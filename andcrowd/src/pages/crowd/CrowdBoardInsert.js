import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import Cookies from "js-cookie";

const CrowdBoardInsert = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        crowdBoardTag: "",
        crowdBoardTitle: "",
        crowdBoardContent: "",
        crowdImg: "",
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
            if(userIdResponse.ok) {
                const userId = await userIdResponse.json();
                setUserId(userId.userId);
            } else {
                throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
            }
        } catch(error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

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

        console.log("formData:", formData);

        const response = await fetch(`/crowd/${crowdId}/board`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
        });
        alert("공지글이 등록되었습니다.");
        navigate(`/crowd/${crowdId}/board/all`);
    };

    return (
        <div>
            <CrowdToolBar crowdId={crowdId}/>
            <form onSubmit={handleSubmit}>
                <div>
                    회원번호: <input type="text" name="userId" value={userId} readOnly />
                    태그: <input type="text" name="crowdBoardTag" value={formData.crowdBoardTag} onChange={handleInputChange} placeholder="공지 종류 (true(1): 공지, false(0): 새소식)" />
                    제목: <input type="text" name="crowdBoardTitle" value={formData.crowdBoardTitle} onChange={handleInputChange} placeholder="제목" />
                    내용: <input type="text" name="crowdBoardContent" value={formData.crowdBoardContent} onChange={handleInputChange} placeholder="본문" />
                    내용: <input type="file" name="crowdImg" value={formData.crowdImg} onChange={handleInputChange} placeholder="이미지를 첨부하세요" />
                </div>
                <div>
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => navigate(`/crowd/${crowdId}/board/all`)}>업로드 취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrowdBoardInsert;