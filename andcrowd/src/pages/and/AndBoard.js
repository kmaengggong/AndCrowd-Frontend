import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate  } from "react-router-dom";
import AndToolBar from "../../components/and/AndToolBar";
import CountdownTimer2 from "../../components/and/CountdownTimer2";
import '../../styles/and/AndBoard.css'
import { Typography, Button } from "@mui/material";
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { GetUserId } from "../../components/user/GetUserId";


const MyBordPaginate = styled(ReactPaginate).attrs({
  activeClassName: "active",
})`
  margin: 60px 16px;
  display: flex;
  justify-content: center;
  list-style-type: none;
  padding: 0 5rem;
  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    cursor: pointer;
  }
  li.previous a,
  li.next a {
    color: #63b762;
  }
  li.active a {
    color: #91cd96;
    font-weight: 700;
    min-width: 32px;
  }
  li.disabled a {
    color: #a6a6a6;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;


const AndBoard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;

  const [and, setAnd] = useState({});
  const [andBoardList, setAndBoardList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMember, setIsMember] = useState(false); // 멤버 여부
  
  const userId = GetUserId(); // 현재 로그인 중인 사용자 id


  useEffect(() => {
    fetchData();
    fetchIsMember();
  }, [andId,currentPage]);

  useEffect(() => {
    fetchIsMember();
  }, []);

  // 전체 페이지 수를 가져오는 useEffect
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`/and/${andId}/board/list/count`);
        const data = await response.json();
        console.log(data); // 데이터 확인
        setPageCount(Math.ceil(data / 5)); // 페이지 당 5개씩 보여주기로 가정
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

  const fetchIsMember = async () =>{
    try {
      console.log(`/and/${andId}/check-member/${userId}`)
      const response = await fetch(`/and/${andId}/check-member/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsMember(data);
        console.log(data)
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  const sortedAndBoardList = andBoardList.sort((a, b) => {
    if (a.andBoardTag === 0 && b.andBoardTag !== 0) {
      return -1;
    } else if (a.andBoardTag !== 0 && b.andBoardTag === 0) {
      return 1;
    } else {
      return b.andBoardId - a.andBoardId;
    }
  });

  const boardDetail = (andBoardId) => {
    navigate(`/and/${andId}/board/${andBoardId}`);
  };

  return (
    <div>
      <AndToolBar andId={andId} />
      <div id='and-board-container'>
        <div className="title">
          <h2>게시판</h2>
        </div>
        <div className="create">
        { isMember && (
          <Button href={`/and/${andId}/board/create`}
          variant="outlined" color="success">
            글 작성
          </Button>
        )}
        </div>
        <div id='and-board-content'>
          {sortedAndBoardList.map((andBoard) => (
            <div key={andBoard.andBoardId} className={andBoard.andBoardTag === 0 ? 'notice' : 'new'} onClick={() => {boardDetail(andBoard.andBoardId)}}>
              <Typography id='and-board-tag' >
                {andBoard.andBoardTag === 0 ? '공지사항' : '소식'}
              </Typography>
              <Typography id='and-board-title' display="inline">
                {andBoard.andBoardTitle}
              </Typography>
              <CountdownTimer2 andBoard={andBoard}  display="inline"/>
              <hr id='and-board-line'></hr>
            </div>
          ))}
        </div>

          <MyBordPaginate
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
  );
};

export default AndBoard;
