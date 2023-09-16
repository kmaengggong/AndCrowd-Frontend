import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from '../../styles/crowd/CrowdBoardList.module.css';
import CrowdToolBar from "../../components/crowd/CrowdToolBar";



const CrowdBoardList = () => {
    const [boards, setBoards] = useState([]);
    const { crowdId } = useParams();
    const { crowdBoardId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/crowd/${crowdId}/board/all`)
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
            <Link to={`/crowd/${crowdId}/board/${board.crowdBoardId}`}>
                <h2>{board.crowdBoardTitle}</h2>
            </Link>
            <p>{board.crowdBoardContent}</p>
            <img src={board.crowdImg} alt={board.crowdBoardTitle} />
            <p>게시된 날짜: {formatDate(board.publishedAt)}</p>
            <p>수정된 날짜: {formatDate(board.updatedAt)}</p>
            {board.isDeleted ? <p>이 글은 삭제되었습니다.</p> : null}
            <button onClick={() => handleEditClick(board.crowdBoardId)}>Edit</button>
        </li>
    );

    const handleEditClick = async (e) => {
        navigate(`/crowd/${crowdId}/board/${crowdBoardId}/update`);
    }

    const formatDate = (dateTimeString) => { // 날짜, 시간 사이의 TimeZone 표시 제거
        if (!dateTimeString) return ""; 
      
        const formattedString = dateTimeString.replace("T", " ");
      
        return formattedString;
    };

    return (
        <div>
            <CrowdToolBar crowdId = {crowdId} />
            <h3>crowdBoardTeg가 0(새소식)인 게시판:</h3>
            <ul>
                {teg0Boards.map(renderBoard)}
            </ul>

            <h3>crowdBoardTeg가 1(공지)인 게시판:</h3>
            <ul>
                {teg1Boards.map(renderBoard)}
            </ul>
            <Link to={`/crowd/${crowdId}/board`}>글 작성</Link>
        </div>
    );
}

export default CrowdBoardList;