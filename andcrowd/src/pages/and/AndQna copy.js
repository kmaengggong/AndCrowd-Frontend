import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AndToolBar from "../../components/and/AndToolBar";
import { Typography } from "@mui/material";
import '../../styles/and/AndQna.css'
import ReactPaginate from 'react-paginate';

const AndQna = () => {
    const params = useParams();
    const andId = params.andId;
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
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
    }, [andId, currentPage]);

    const fetchData = async () => {
      try {
        const response = await fetch(`/and/${andId}/qna/list?page=${currentPage}`);
        
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

    // 전체 페이지 수를 가져오는 useEffect
    useEffect(() => {
      const fetchCount = async () => {
        try {
          const response = await fetch(`/and/${andId}/qna/list/count`);
          const data = await response.json();
          console.log(data); // 데이터 확인
          setPageCount(Math.ceil(data / 5)); // 페이지 당 10개씩 보여주기로 가정
        } catch (error) {
          console.error("Error fetching page count:", error);
        }
      };
      
      fetchCount();
    }, [andId]);

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

  const dateObject = new Date(dateTimeString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  const formattedString = `${year}-${month}-${day}`;

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
          
        <ReactPaginate
        pageCount={pageCount}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousLabel="< "
        nextLabel=" >"  
        pageRangeDisplayed={5}
        marginPagesDisplayed={0}
        breakLabel="..."
        renderOnZeroPageCount={null}
        />

      </div>
    );
};
export default AndQna;