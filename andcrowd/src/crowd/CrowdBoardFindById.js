import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

const CrowdBoardFindById = () => {
    const [board, setBoard] = useState(null);
    const { crowdId, crowdBoardId } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/crowd/${crowdId}/board/${crowdBoardId}`)
            .then(response => {
                setBoard(response.data);
            })
            .catch(error => {
                console.error("잘못된 정보가 전달되었습니다.", error);
            });
    }, [crowdId, crowdBoardId]);

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
                <p>삭제 여부 : {board.deleted}</p>
            </div>
        );
    };

    return (
        <div>
            {board && renderBoard(board)}
        </div>
    );
}

export default CrowdBoardFindById;