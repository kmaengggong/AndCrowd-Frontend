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
    const [andQnaList, setAndQnaList] = useState([]);
    const [selectedQnaId, setSelectedQnaId] = useState(null);
    const [andReplyList, setAndReplyList] = useState({});
    const handleQnaClick = (qnaId,andQna) => {
      if (selectedQnaId === qnaId) {
        fetchReplyData(andId, qnaId)
        setSelectedQnaId(null);
      } else {
        fetchReplyData(andId, qnaId)
        setSelectedQnaId(qnaId);
      }
    };
    useEffect(() => {
      fetchData();
    }, [andId]);
    const fetchData = async () => {
      try {
        const response = await fetch(`/and/${andId}/qna/list`);
        if (response.ok) {
          const data = await response.json();
          setAndQnaList(data);
        } else {
          throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
      } catch (error) {
        console.error("Error fetching And data:", error);
      }
    };
    const fetchReplyData = async (andId, andQnaId) => {
      console.log("andQnaId: ", andQnaId)
      try {
        const qnaReplyResponse = await fetch(`/and/${andId}/qna/reply/${andQnaId}/all`);
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
    const formatDate = (dateTimeString) => {
      if (!dateTimeString) return ""; 
    
      const formattedString = dateTimeString.replace("T", " ");
    
      return formattedString;
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
              <Typography id='time-text-qna'>{formatDate(andQna.updatedAt)}</Typography>
              <hr id='and-qna-line'></hr>
              {selectedQnaId === andQna.andQnaId && (
                <div id='qna-div'
                  style={{
                    cursor: 'pointer'
                  }}>
                  <h2 id='qna-content'>{andQna.andQnaContent}</h2>
                </div>
              )}
              {selectedQnaId === andQna.andQnaId && (
                <div id='qna-div'>
                  <hr id='and-qna-line'></hr>
                  {andReplyList.length > 0 ? (
                    andReplyList.map(comment => (
                      <div key={comment.andReplyId}>
                        <p>답변: {comment.andReplyContent}</p>
                        <p>{formatDate(comment.updatedAt)}</p>
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