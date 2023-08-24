import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import styles from './CrowdBoardFindAll.module.css';


const CrowdBoardFindAll = () => {
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

    const teg0Boards = boards.filter(board => board.crowdBoardTag === 0);
    const teg1Boards = boards.filter(board => board.crowdBoardTag === 1);

    const renderBoard = (board) => (
        <li key={board.crowdBoardId}>
            <h2>{board.crowdBoardTitle}</h2>
            <p>{board.crowdBoardContent}</p>
            <img src={board.crowdImg} alt={board.crowdBoardTitle} />
            <p>게시된 날짜: {board.publishedAt}</p>
            <p>수정된 날짜: {board.updatedAt}</p>
            {board.isDeleted ? <p>이 글은 삭제되었습니다.</p> : null}
        </li>
    );

    return (
        <div>
            <h3>crowdBoardTeg가 0인 게시판:</h3>
            <ul>
                {teg0Boards.map(renderBoard)}
            </ul>

            <h3>crowdBoardTeg가 1인 게시판:</h3>
            <ul>
                {teg1Boards.map(renderBoard)}
            </ul>
        </div>
    );
}

export default CrowdBoardFindAll;