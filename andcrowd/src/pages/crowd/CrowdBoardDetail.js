import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import CrowdToolBar from "../../components/crowd/CrowdToolBar";

const CrowdBoardDetail = () => {
    const [board, setBoard] = useState(null);
    const { crowdId, crowdBoardId } = useParams();

    useEffect(() => {
        axios.get(`/crowd/${crowdId}/board/${crowdBoardId}`)
            .then(response => {
                setBoard(response.data);
            })
            .catch(error => {
                console.error("잘못된 정보가 전달되었습니다.", error);
            });
    }, [crowdId, crowdBoardId]);

    const navigate = useNavigate(); // 삭제 후 리다이렉션을 위한 useNavigate

    const handleDelete = () => {
        axios.patch(`/crowd/${crowdId}/board/${crowdBoardId}/delete`)
            .then(() => {
                alert("글이 성공적으로 삭제되었습니다.");
                setBoard({ ...board, deleted: true }); // Update the board state to reflect the deletion
                navigate(`/crowd/${crowdId}`); // 해당 크라우드의 메인 페이지로 리다이렉트
            })
            .catch(error => {
                console.error("글을 삭제하는 동안 오류가 발생했습니다.", error);
                alert("글 삭제 실패");
            });
    };

    const renderBoard = (board) => {
        if (board.deleted === true) {
            return <p>이 글은 삭제되었습니다.</p>;
        }
        return (
            <div key={board.crowdBoardId}>
                <h2>{board.crowdBoardTitle}</h2>
                <p>{board.crowdBoardContent}</p>
                <img src={board.crowdImg} alt={board.crowdBoardTitle} />
                <p>게시된 날짜: {board.publishedAt}</p>
                <p>수정된 날짜: {board.updatedAt}</p>
                <p>삭제 여부 : {board.deleted ? "삭제됨" : "삭제되지 않음"}</p>
                <button onClick={handleDelete}>글 삭제</button> {/* 삭제 버튼 추가 */}
            </div>
        );
    };

    return (
        <div>
            <CrowdToolBar crowdId={crowdId} />
            {board && renderBoard(board)}
        </div>
    );
}

export default CrowdBoardDetail;
