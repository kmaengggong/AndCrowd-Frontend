import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetUserId } from "../../components/user/GetUserId";

const CrowdReplyCreate = () => {
    const navigate = useNavigate();

    const params = useParams();
    const crowdId = params.crowdId;
    const crowdQnaId = params.crowdQnaId;

    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        userId: "",
        crowdQnaId: crowdQnaId,
        qnaReplyContent: "",
    });

    useEffect(() => {
        setUserId(GetUserId());
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

        console.log("formdata: ", formData);

        const response = await fetch(`/crowd/${crowdId}/qna/reply/${crowdQnaId}/create`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
        });
        navigate(`/crowd/${crowdId}/qna/${crowdQnaId}`);
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={userId} readOnly />
                    <input type="text" name="qnaReplyContent" value={formData.qnaReplyContent} onChange={handleInputChange} placeholder="댓글을 입력하세요" />
                </div>
                <div id="submit_btn">
                    <button type="submit">저장</button>
                </div>
            </form>
        </div>
    )
}

export default CrowdReplyCreate;