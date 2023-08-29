import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const AndBoardDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;

  const navigate = useNavigate();

  const [andBoard, setAndBoard] = useState({});

  useEffect(() => {
    fetchData();
  }, [andId, andBoardId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/${andBoardId}`);

      if (response.ok) {
        const data = await response.json();
        setAndBoard(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const deleteAndBoard = async (andId, andBoardId) => {
    try {
      await axios.delete(`/and/${andId}/board/${andBoardId}/delete`);
      console.log("Deleted andBoard with ID:", andBoardId);
      navigate(`/and/${andId}/board/list`);
    } catch (error) {
      console.error("Error in deleting andBoard:", error);
    }
  };

  const updateAndBoard = (andId, andBoardId) => {
    navigate(`/and/${andId}/board/${andBoardId}/update`);
  };

  return (
    <div>
      <div> 
        <h4>제목: {andBoard.andBoardTitle}</h4>
        <p>내용: {andBoard.andBoardContent}</p>
        <br />
        <button onClick={() => deleteAndBoard(andId, andBoardId)}>삭제</button>
        <button onClick={() => updateAndBoard(andId, andBoardId)}>수정</button>
      </div>
    </div>
  );
};

export default AndBoardDetail;
