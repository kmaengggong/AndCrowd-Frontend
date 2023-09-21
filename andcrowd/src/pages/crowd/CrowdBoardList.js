import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { GetUserId } from "../../components/user/GetUserId";
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { getUserNickname } from "../../components/and/userApi";

const MyBoardPaginate = styled(ReactPaginate).attrs({
    activeClassName: "active",
  })`
    margin: 50px auto;
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

const CrowdBoardList = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdBoardId = params.crowdBoardId;
    const userId = GetUserId(); // 현재 로그인한 사용자 ID

    const [crowd, setCrowd] = useState({});
    const [crowdBoardList, setCrowdBoardList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [boardTag, setBoardTag] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        checkUserPermission();
    }, [crowdId, currentPage]);

    const checkUserPermission = async () => {
        try {
          const userId = GetUserId();
          const response = await fetch(`/crowd/${crowdId}/board/user-check/${userId}`);
      
          if (response.ok) {
            const isAdmin = await response.json();
            setIsAdmin(isAdmin);
            console.log(isAdmin);
          } else {
            throw new Error(`Fetching admin status failed with status ${response.status}.`);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
    };

    useEffect(() => { // 전체 페이지 수 카운트
        const fetchCount = async () => {
            try {
                const response = await fetch(`/crowd/${crowdId}/board/all/count`);
                const data = await response.json();
                console.log(data);
                setPageCount(Math.ceil(data / 5));
            } catch (error) {
                console.error("Error fetching page count:", error);
            }
        }
        fetchCount();
    }, [crowdId]);

    const fetchData = async () => { // userId 불러오기
        try{
            const response = await fetch(`/crowd/${crowdId}/board/all?page=${currentPage}`);
            if(response.ok) {
                const data = await response.json();

                for(const crowdBoard of data) {
                    const userNickname = await getUserNickname(crowdBoard.userId);
                    crowdBoard.userNickname = userNickname;
                }
                setCrowdBoardList(data);
            } else {
                throw new Error(`Fetching CrowdBoard data failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Error fetching CrowdBoard data:", error);
        }   
    };

    const sortedCrowdBoardList = crowdBoardList.sort((a, b) => { // 공지, 새소식 구분해주는 함수
        if(a.crowdBoardTag === 0 && b.crowdBoardTag !== 0){
            return -1;
        } else if (a.crowdBoardTag !== 0 && b.crowdBoardTag === 0) {
            return 1;
        } else {
            return b.crowdBoardId - a.crowdBoardId;
        }
    });

    const createBoard = (crowdId) => { // 글생성
        navigate(`/crowd/${crowdId}/board`);
    };

    const handleClickBoard = (crowdBoardId) => {
        navigate(`/crowd/${crowdId}/board/${crowdBoardId}`);
    }    

    const formatDate = (dateTimeString) => { // 작성일 표기
        if (!dateTimeString) return "";
      
        const dateObject = new Date(dateTimeString);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
      
        const formattedString = `${year}-${month}-${day}`;
      
        return formattedString;
    };

    return (
        <div id='crowd-board-container'>
            <CrowdToolBar crowdId={crowdId} />
            <div className="title">
                <h3>Board</h3>
                {isAdmin && userId ? (
                <Button onClick={() => createBoard(crowdId)} variant="outlined" color="success">
                    공지글 작성
                </Button>
                ) : (
                    <p>Read Only</p>
                )}
            </div>
            <div id="board-box">
                <TableContainer>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">구분</TableCell>
                            <TableCell align="center">제목</TableCell>
                            <TableCell align="center">작성일</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                    {sortedCrowdBoardList.map((crowdBoard) => (
                        <>
                        <TableRow hover style={{height: 50}} 
                            key={crowdBoard.crowdBoardId}
                            className={crowdBoard.crowdBoardTag === 0 ? 'notice' : ''}>
                            <TableCell align="center" sx={{ width: "10%", borderBottom: "none" }}>
                                {crowdBoard.crowdBoardTag === 0 ? (<p>새소식</p>) : (<p>공지사항</p>)}
                            </TableCell>
                            <TableCell align="center">
                                <Button onClick={() => handleClickBoard(crowdBoard.crowdBoardId)}>
                                    {crowdBoard.crowdBoardTitle}
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                {formatDate(crowdBoard.updatedAt)}
                            </TableCell>
                        </TableRow>
                        </>
                    ))}
                    </TableBody>
                    </Table>
                </TableContainer>

                <MyBoardPaginate
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
}

export default CrowdBoardList;