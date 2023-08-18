import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AndDetail = () => {
  const params = useParams();
  const andId = params.andId;

  const [and, setAnd] = useState({});

  useEffect(() => {
    fetchData();
  }, [andId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnd(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };


  return (
    <div>
      <div> 
        <h4>제목: {and.andTitle}</h4>
        <p>본문: {and.andContent}</p>
        <p>마감일: {and.andEndDate}</p>
        <br />
      </div>
      <div>
      <Link to={`/and/${and.andId}/qna/list`}>
        <button>qna</button>
        </Link>
        <button>게시판</button>
      </div>
    </div>
  );
};

export default AndDetail;