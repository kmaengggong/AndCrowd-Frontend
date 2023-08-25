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

  useEffect(() => {
    fetchData();
  }, [andId, andQnaId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/qna/${andQnaId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAndQna(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
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


    if (andQna.deleted === true) {
      alert("이 글은 삭제되었습니다.");
      window.location.href = `/and/${andId}/qna/list`;
    };


  return (
    <div>
      <div> 
        <h4>제목: {andQna.andQnaTitle}</h4>
        <p>본문: {andQna.andQnaContent}</p>
        <br />
        <button onClick={() => deleteAndQna(andId, andQnaId)}>delete</button>
        <button onClick={() => updateAndQna(andId, andQnaId)}>update</button>
      </div>
    </div>
  );
};

export default AndQnaDetail;