import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import { GetUserId } from "../../components/user/GetUserId";
import { Button } from "@mui/material";
import Editor from "../../components/and/Editor";

const CrowdBoardInsert = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const [userId, setUserId] = useState("");
    // const [crowdBoardTag, setCrowdBoardTag] = useState(0); // 0:"새소식", 1:"공지사항"
    const [htmlStr, setHtmlStr] = React.useState('');

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        crowdBoardTag: "",
        crowdBoardTitle: "",
        crowdBoardContent: "",
        crowdImg: "",
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
        crowdBoardContent: htmlStr,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData:", formData);
        const response = await fetch(`/crowd/${crowdId}/board`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...updatedFormData}),
        });
        alert("공지글이 등록되었습니다.");
        navigate(`/crowd/${crowdId}/board/all`);
    };

    return (
        <div>
            <CrowdToolBar crowdId={crowdId}/>
            <form onSubmit={handleSubmit}>
                <div id="board-submit-btn">
                    <Button id="board-can-btn" type="button" onClick={() => navigate(`/crowd/${crowdId}/board/all`)}>취소</Button>
                    <Button id="board-save-btn" type="submit">저장</Button>
                </div>
                <div>
                    회원ID: <input id="crowdBoard-input" type="text" name="userId" value={userId} readOnly />
                    <select
                        name="crowdBoardTag"
                        value={formData.crowdBoardTag}
                        onChange={handleInputChange}
                        id = 'crowdBoard-input2'
                        required
                        >
                        <option value="">글 유형 선택</option>
                        <option value="0">새소식</option>
                        <option value="1">공지사항</option>
                    </select> <br />
                    <input id="crowdBoard-input" type="text" name="crowdBoardTitle" value={formData.crowdBoardTitle} onChange={handleInputChange} placeholder="제목" /> <br />
                    <div id="editdiv">
                        <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CrowdBoardInsert;