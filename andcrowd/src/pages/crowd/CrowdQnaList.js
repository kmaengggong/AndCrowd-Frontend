import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CrowdQnaList = () => {
    const [ qna, setQna ] = useState([]);
    const { crowdId } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/crowd/${crowdId}/qna/all`)
        .then(response => {
            setQna(response.data);
        })
        .catch(error => {
            console.error("잘못된 정보가 전달되었습니다.", error);
        });
    },[crowdId]);

    const renderQna = (qna) => {
        <li key={qna.crowdQnaId}>
            <h2>{qna.qnaTitle}</h2>
            <p>{qna.qnaContent}</p>
            <p>게시된 날짜: {qna.publishedAt}</p>
            <p>수정된 날짜: {qna.updatedAt}</p>
            {qna.isDeleted ? <p>이 글은 삭제되었습니다.</p> : null}
        </li>
    };
    
    return(
        <div>
            <h3>QnA를 자유롭게 올려보세요</h3>
            <ul>
                {(renderQna)}
            </ul>
        </div>
    );
};

export default CrowdQnaList;