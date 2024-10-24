import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import { Button } from "@mui/material";
import Editor from "../../components/and/Editor";
import { GetUserId } from "../../components/user/GetUserId";

const CrowdBoardUpdate = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdBoardId = params.crowdBoardId;
    const [htmlStr, setHtmlStr] = React.useState('');
    const userId = GetUserId();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        crowdBoardId: crowdBoardId,
        userId: "",
        crowdBoardTitle: "",
        crowdBoardContent: "",
    });

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/board/${crowdBoardId}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
                setHtmlStr(data.crowdBoardContent);
            } else {
                throw new Error(`Fetching CrowdBoard data failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("게시물 데이터를 불러오는 중 오류 발생!", error);
        }
    };    

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
        crowdBoardContent: htmlStr,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("formdata:",formData);
        try{
            const response = await fetch(`/crowd/${crowdId}/board/${crowdBoardId}/update`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...updatedFormData, crowdBoardContent: htmlStr}),
            });
            console.log("formdata:", formData);
            if(response.ok) {
                navigate(`/crowd/${crowdId}/board/${crowdBoardId}`);
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
        
    };

    const handleUpdateCancelBtn = () => {
        // 수정 취소 버튼을 클릭했을 때 이전 페이지로 이동
        alert("수정이 취소되었습니다.")
        navigate(`/crowd/${crowdId}/board/all`);
    }

    return (
        <div id="board-update-form">
            <CrowdToolBar crowdId={crowdId} />
            <form onSubmit={handleSubmit}>
                <div id="update-submit-btn">
                    <button type="button" onClick={handleUpdateCancelBtn}>취소</button>
                    <button type="submit" onClick={handleSubmit}>저장</button>
                </div>
                <div>
                    <input id="crowdBoard-update-input" type="text" name="crowdBoardTitle" value={formData.crowdBoardTitle} onChange={handleInputChange} placeholder="제목" /> <br />
                </div>
                <div id="editdiv">
                    <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
                </div>
            </form>
        </div>
    );
}

export default CrowdBoardUpdate;
