import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './AndQna.css';

const AndQna = () => {

    const params = useParams();
    const andId = params.andId;
    const andQnaId = params.andQnaId;
  
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [andQnaList, setAndQnaList] = useState([]);
  
    useEffect(() => {
      fetchData();
    }, [currentPage]);
  
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

return (
    <div>
      <h1>And Qna List</h1>
        <table>
            <thead>
                <tr>
                <th>번호</th>
                <th>제목</th>
                <th>내용</th>
                <th>작성일</th>
                <th>수정일</th>
                </tr>
            </thead>
            <tbody>
                {andQnaList.map((andQna) => (
                <tr key={andQna.andQnaId}>
                    <td>{andQna.andQnaId}</td>
                    <td><Link to={`/and/${andId}/qna/${andQna.andQnaId}`}>{andQna.andQnaTitle}</Link></td>
                    <td>{andQna.andQnaContent}</td>
                    <td>{andQna.publishedAt}</td>
                    <td>{andQna.updatedAt}</td>
                </tr>
                ))}
            </tbody>
        </table>
        <Link to={`/and/${andId}/qna/create`}>문의글 작성</Link>
      {/* 페이지 링크를 출력하는 부분 */}
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousLabel="<"
        nextLabel=">"  
      />
    </div>
    );
};

export default AndQna;