import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import '../../styles/crowd/CrowdQnaCreate.css';
import Editor from "../../components/and/Editor";
import { GetUserId } from "../../components/user/GetUserId";

const CrowdQnaCreate = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const [userId, setUserId] = useState("");
    const [htmlStr, setHtmlStr] = React.useState('');

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        qnaTitle: "",
        qnaContent: "",
    });

    // const userAccessToken = Cookies.get('refresh_token');

    // const fetchData = async () => {
    //     try {
    //         const userIdResponse = await fetch(`/user-info/userid`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${userAccessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         if (userIdResponse.ok) {
    //             const userId = await userIdResponse.json();
    //             setUserId(userId.userId);
    //         } else {
    //         throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
    //         }
    //         } catch (error) {
    //         console.error("Error fetching data:", error);
    //         }
    // };

    useEffect(() => {
        setUserId(GetUserId());
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
        qnaContent: htmlStr
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

        alert("문의글이 정상 등록되었습니다.");
        navigate(`/crowd/${crowdId}/qna/all`);
    };

    return(
        <div>
            <CrowdToolBar crowdId={crowdId} />
            <form onSubmit={handleSubmit}>
                <div id="qna-submit_btn">
                    <button id='board-can-btn' type="button" onClick={() => navigate(`/crowd/${crowdId}/qna/all`)}>취소</button>
                    <button id='board-save-btn' type="submit">저장</button>
                </div>
                <div>
                    회원ID: <input id='qna-input' type="text" name="userId" value={userId} readOnly /><br />
                    제목: <input id='qna-input' type="text" name="qnaTitle" value={formData.qnaTitle} onChange={handleInputChange} placeholder="제목" />
                    <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor>
                </div>
            </form>
        </div>
    )
}

export default CrowdQnaCreate;