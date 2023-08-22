import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


const AndQnaDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const andQnaId = params.andQnaId;

  const navigate = useNavigate();


  const [andQna, setAndQna] = useState({});
  const [andReplyList, setAndReplyList] = useState({});

  useEffect(() => {
    fetchData();
  }, [andId, andQnaId]);

  const fetchData = async () => {
    try {
      const qnaResponse = await fetch(`/and/${andId}/qna/${andQnaId}`);
      if (qnaResponse.ok) {
        const qnaData = await qnaResponse.json();
        setAndQna(qnaData);
      } else {
        throw new Error(`Fetching and data failed with status ${qnaResponse.status}.`);
      }

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


  const deleteAndQna = async (andId, andQnaId) => {
    try {
      await axios.delete(`/and/${andId}/qna/${andQnaId}/delete`);
      console.log("Deleted and with ID:", andQnaId);
      navigate(`/and/${andId}/qna/list`);
    } catch (error) {
      console.error("error in deleting and:", error);
    }
  };

  const updateAndQna = (andId, andQnaId) => {
    navigate(`/and/${andId}/qna/${andQnaId}/update`);
  };

  const deleteAndReply = async (andId, andQnaId, andReplyId) => {
    try {
      await axios.delete(`/and/${andId}/qna/reply/${andQnaId}/${andReplyId}/delete`);
      console.log("Deleted and with ID:", andQnaId);
      fetchData();
        } catch (error) {
      console.error("error in deleting and:", error);
    }
  };

  const updateAndReply = (andId, andQnaReplyId) => {
    navigate(`/and/${andId}/qna/reply/${andQnaId}/${andQnaReplyId}/update`);
  };

  const createAndReply = (andId, andQnaId) => {
    navigate(`/and/${andId}/qna/reply/${andQnaId}/create`);
  };

  return (
    <>
      <div>
        <div> 
          <h4>제목: {andQna.andQnaTitle}</h4>
          <p>본문: {andQna.andQnaContent}</p>
          <br />
          <button onClick={() => updateAndQna(andId, andQnaId)}>update</button>
          <button onClick={() => deleteAndQna(andId, andQnaId)}>delete</button>
          <br />
          <br />
          <button onClick={() => createAndReply(andId, andQnaId)}>답변달기</button>
        </div>
      </div>
      <hr />
      <hr />
      <div>
        {andReplyList.length > 0 ? (
          andReplyList.map(comment => (
            <div key={comment.andReplyId}>
              <p>답변번호: {comment.andReplyId}</p>
              <p>답변내용: {comment.andReplyContent}</p>
              <p>답변자: {comment.userId}</p>
              <p>마지막시간: {comment.updatedAt}</p>
              <button onClick={() => updateAndReply(andId, comment.andReplyId)}>update</button>
              <button onClick={() => deleteAndReply(andId, andQnaId, comment.andReplyId)}>delete</button>
              <hr />
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </>
  );
};

export default AndQnaDetail;