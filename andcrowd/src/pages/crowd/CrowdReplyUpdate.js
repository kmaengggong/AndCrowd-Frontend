import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CrowdReplyUpdate = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdQnaId = params.crowdQnaId;
    const qnaReplyId = params.qnaReplyId;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        crowdQnaId: crowdQnaId,
        qnaReplyId: qnaReplyId,
        userId: "",
        qnaReplyContent: "",
    });

    useEffect(() =>{
        fetchData();
    },[]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`);
            if(response.ok) {
                const data = await response.json();
                setFormData(data);
            } else {
                throw new Error(`Fetching and data failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Error fetching Crowd Qna data:", error);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formdata:", formData);
        const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        navigate(`/crowd/${crowdId}/qna/${crowdQnaId}`);
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    회원번호: <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" readOnly/>
                    <input type="text" name="qnaReplyContent" value={formData.qnaReplyContent} onChange={handleInputChange} placeholder="답변내용" />
                </div>
                <div id="submit_btn">
                    <button type="submit">저장</button>
                </div>
            </form>
            <button></button>
        </div>
    )
}

export default CrowdReplyUpdate;