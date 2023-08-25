import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const AndBoard = () => {
  const params = useParams();
  const andId = params.andId;

  const [andBoardList, setAndBoardList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/list`);

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

  return (
    <div>
      <h1>AndBoard List</h1>
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
          {andBoardList.map((andBoard) => (
            <tr key={andBoard.andBoardId}>
              <td>{andBoard.andBoardId}</td>
              <td>
                <Link to={`/and/${andId}/board/${andBoard.andBoardId}`}>
                  {andBoard.andBoardTitle}
                </Link>
              </td>
              <td>{andBoard.andBoardContent}</td>
              <td>{andBoard.publishedAt}</td>
              <td>{andBoard.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/and/${andId}/board/create`}>글 작성</Link>
    </div>
  );
};

export default AndBoard;
