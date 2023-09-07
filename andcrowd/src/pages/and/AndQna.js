import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AndToolBar from "../../components/and/AndToolBar";
import { Typography } from "@mui/material";
import '../../styles/and/AndQna.css'

const AndQna = () => {
    const params = useParams();
    const andId = params.andId;
    const andQnaId = params.andQnaId;
    console.log(andQnaId);
    const [andQnaList, setAndQnaList] = useState([]);
    const [selectedQnaId, setSelectedQnaId] = useState(null);
    const [andReplyList, setAndReplyList] = useState({});

    const handleQnaClick = (qnaId) => {
      if (selectedQnaId === qnaId) {
        setSelectedQnaId(null);
      } else {
        setSelectedQnaId(qnaId);
      }
    };

    useEffect(() => {
      fetchData();
    }, [andId, andQnaId]);
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/and/${andId}/qna/list`);
        
        if (response.ok) {
          const data = await response.json();
          setAndQnaList(data);
        } else {
          throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
    
        const qnaReplyResponse = await fetch(`/and/${andId}/qna/reply/${andQna.andQnaId}/all`);
        if (qnaReplyResponse.ok) {
          const qnaReplyData = await qnaReplyResponse.json();
          setAndReplyList(qnaReplyData);
        } else {
          throw new Error(`Fetching and data failed with status ${qnaReplyResponse.status}.`);
      }
  
      } catch (error) {
        console.error("Error fetching And data:", error);
      }
    };
  

    return (
      <div id='qna-container'>
        <div id='qna-box'>
        <AndToolBar andId={andId} />
          {andQnaList.map((andQna) => (
            <div key={andQna.andQnaId}>
              <Typography id='and-qna-title' display="inline">
                <div
                  onClick={() => handleQnaClick(andQna.andQnaId)}
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  {andQna.andQnaTitle}
                </div>
              </Typography>
              <Typography>{andQna.updatedAt}</Typography>
              {selectedQnaId === andQna.andQnaId && (
                <div id='qna-div'>
                  <h2 id='qna-content'>{andQna.andQnaContent}</h2>
                  <p>{andQna.andQnaId}</p>
                </div>
                
              )}
              {selectedQnaId === andQna.andQnaId && (
                <div id='qna-div'>
                  <hr id='and-qna-line'></hr>
                  <h3>답변 목록</h3>
                  {andReplyList.length > 0 ? (
                    andReplyList.map(comment => (
                      <div key={comment.andReplyId}>
                        <p>답변번호: {comment.andReplyId}</p>
                        <p>답변내용: {comment.andReplyContent}</p>
                        <p>답변자: {comment.userId}</p>
                        <p>마지막시간: {comment.updatedAt}</p>
                        
                      </div>
                    ))
                  ) : (
                    <p>답변이 없습니다.</p>
                  )}
                  <hr id='and-qna-line'></hr>
                </div>
                
              )}
              
            </div>
          ))}
        </div>
  
        <Link to={`/and/${andId}/qna/create`}>글 작성</Link>
      </div>
    );
};

export default AndQna;