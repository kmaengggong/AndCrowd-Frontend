import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AndToolBar from "../../components/and/AndToolBar";
import CountdownTimer2 from "../../components/and/CountdownTimer2";
import '../../styles/and/AndBoard.css'
import { Typography } from "@mui/material";
import ReactPaginate from 'react-paginate';

const AndBoard = () => {
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;

  const [and, setAnd] = useState({});
  const [andBoardList, setAndBoardList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [andId,currentPage]);

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


  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/list?page=${currentPage}`);
      if (response.ok) {
        const data = await response.json();
        setAndBoardList(data);
      } else {
        throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching AndBoard data:", error);
    }
  };

  const sortedAndBoardList = andBoardList.sort((a, b) => {
    if (a.andBoardTag === 0 && b.andBoardTag !== 0) {
      return -1;
    } else if (a.andBoardTag !== 0 && b.andBoardTag === 0) {
      return 1;
    } else {
      return b.andBoardId - a.andBoardId;
    }
  });

  return (
    <div>
      <AndToolBar andId={andId} />
      <div id='and-board-container'>
        <div id='and-board-content'>
          {sortedAndBoardList.map((andBoard) => (
            <div key={andBoard.andBoardId} className={andBoard.andBoardTag === 0 ? 'notice' : ''}>
              <Typography id='and-board-tag' >
                {andBoard.andBoardTag === 0 ? '공지사항' : '소식'}
              </Typography>
              <Typography id='and-board-title' display="inline">
                <Link to={`/and/${andId}/board/${andBoard.andBoardId}`}>
                  {andBoard.andBoardTitle}
                </Link>
              </Typography>
              <CountdownTimer2 andBoard={andBoard}  display="inline"/>
              <hr id='and-board-line'></hr>
            </div>
          ))}
          <Link id='board-write' to={`/and/${andId}/board/create`}>글 작성</Link>

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
      </div>
    </div>
  );
};

export default AndBoard;
