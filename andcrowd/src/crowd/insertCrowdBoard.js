import React, { useState } from "react";
import axios from "axios";

const InsertCrowdBoard = () => {
    const [crowdBoardTag, setCrowdBoardTag] = useState("");
    const [crowdBoardTitle, setCrowdBoardTitle] = useState("");
    const [crowdBoardContent, setCrowdBoardContent] = useState("");
    const [crowdBoardImg, setCrowdBoardImg] = useState("");
    const { crowdId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const boardData = {
            crowdBoardTag: crowdBoardTag,
            crowdBoardTitle: crowdBoardTitle,
            crowdBoardContent: crowdBoardContent,
            crowdBoardImg: crowdBoardImg
        };

        try {
            const response = await axios.post(`http://localhost:8080/crowd/${crowdId}/board`, boardData);
            console.log(response.data);
            alert("공지사항 등록 완료");
        } catch (error) {
            console.error("There was an error!", error);
            alert("등록 실패");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title: </label>
                    <input type="text" value={crowdBoardTitle} onChange={(e) => setCrowdBoardTitle(e.target.value)} />
                </div>
                <div>
                    <label>Content: </label>
                    <textarea value={crowdBoardContent} onChange={(e) => setCrowdBoardContent(e.target.value)} />
                </div>
                <div>
                    <label>Tag: </label>
                    <textarea value={crowdBoardTag} onChange={(e) => setCrowdBoardTag(e.target.value)} />
                </div>
                <div>
                    <label>Img: </label>
                    <textarea value={crowdBoardImg} onChange={(e) => setCrowdBoardImg(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default InsertCrowdBoard;