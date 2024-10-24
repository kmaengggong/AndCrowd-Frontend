import React, { useEffect, useState } from "react";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import { useNavigate, useParams } from "react-router-dom";

const CrowdQnaUpdate = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdQnaId = params.crowdQnaId;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        crowdQnaId: crowdQnaId,
        userId: "",
        qnaTitle: "",
        qnaContent: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
              } else {
                throw new Error(`Fetching and data failed with status ${response.status}.`);
              }
        
            } catch (error) {
              console.error("Error fetching Crowd Qna data:", error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("formData:", formData);
        const res = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/update`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(formData),
        });
        navigate(`/crowd/${crowdId}/qna/all`);
    };
    
    return (
        <div>
            <CrowdToolBar crowdId={crowdId} />
            <form onSubmit={handleSubmit}>
                <div>
                    회원번호: <input type="text" name="userId" value={formData.userId} readOnly />
                    제목: <input type="text" name="qnaTitle" value={formData.qnaTitle} onChange={handleInputChange} placeholder="제목" />
                    본문: <input type="text" name="qnaContent" value={formData.qnaContent} onChange={handleInputChange} placeholder="본문" />
                </div>
                <div id="submitBtn">
                    <button type="submit">수정하기</button>
                </div>
            </form>
        </div>
    )
}

export default CrowdQnaUpdate;