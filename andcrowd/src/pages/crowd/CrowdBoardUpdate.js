import React, { useState, useEffect } from "react"; // useEffect 추가
import axios from "axios";
import { useParams } from "react-router-dom";

const CrowdBoardUpdate = () => {
    const [crowdBoardTag, setCrowdBoardTag] = useState("");
    const [crowdBoardTitle, setCrowdBoardTitle] = useState("");
    const [crowdBoardContent, setCrowdBoardContent] = useState("");
    const [crowdBoardImg, setCrowdBoardImg] = useState("");
    const { crowdId, crowdBoardId } = useParams(); // 두 변수를 한번에 가져오기

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/crowd/${crowdId}/board/${crowdBoardId}`);
                const board = response.data;
                console.log(board);
                setCrowdBoardTag(board.crowdBoardTag);
                setCrowdBoardTitle(board.crowdBoardTitle);
                setCrowdBoardContent(board.crowdBoardContent);
                setCrowdBoardImg(board.crowdBoardImg);
            } catch (error) {
                console.error("Error fetching the board data!", error);
            }
        };

        fetchData();
    }, [crowdId, crowdBoardId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const boardData = {
            crowdId: crowdId,
            crowdBoardId: crowdBoardId,
            crowdBoardTag: crowdBoardTag,
            crowdBoardTitle: crowdBoardTitle,
            crowdBoardContent: crowdBoardContent,
            crowdBoardImg: crowdBoardImg
        };

        try {
            const response = await axios.patch(`/crowd/${crowdId}/board/${crowdBoardId}/update`, boardData);
            alert("공지사항 수정 완료");
        } catch (error) {
            console.error("There was an error!", error);
            alert("수정 실패");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="hidden" name="crowdId" value={crowdId} />
                </div>
                <div>
                    <input type="hidden" name="crowdBoardId" value={crowdBoardId} />
                </div>
                <div>
                    <label>Tag: </label>
                    <textarea type="text" value={crowdBoardTag} onChange={(e) => setCrowdBoardTag(e.target.value)} />
                </div>
                <div>
                    <label>Title: </label>
                    <textarea type="text" value={crowdBoardTitle} onChange={(e) => setCrowdBoardTitle(e.target.value)} />
                </div>
                <div>
                    <label>Content: </label>
                    <textarea type="text" value={crowdBoardContent} onChange={(e) => setCrowdBoardContent(e.target.value)} />
                </div>
                <div>
                    <label>Img: </label>
                    <textarea type="text" value={crowdBoardImg} onChange={(e) => setCrowdBoardImg(e.target.value)} />
                </div>
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
}

export default CrowdBoardUpdate;
