import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';


const CrowdBoard = () => {
    const [boards, setBoards] = useState([]);
    const { crowdId } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/crowd/${crowdId}/board/all`)
        .then(response => {
            setBoards(response.data);
        })
        .catch(error => {
            console.error("잘못된 정보가 전달되었습니다.", error);
        });
    }, [crowdId]);


    return (
        <div>
            <ul>
                {boards.map(board => (
                    <li key={board.crowdBoardId}>
                        <h2>{board.crowdBoardTitle}</h2>
                        <p>{board.crowdBoardContent}</p>
                        <img src={board.crowdImg} alt={board.crowdBoardTitle} />
                        <p>게시된 날짜: {board.publishedAt}</p>
                        <p>수정된 날짜: {board.updatedAt}</p>
                        {board.isDeleted ? <p>이 글은 삭제되었습니다.</p> : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CrowdBoard;