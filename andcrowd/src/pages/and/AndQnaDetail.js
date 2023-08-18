import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AndQnaDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const andQnaId = params.andQnaId;

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


  return (
    <div>
      <div> 
        <h4>제목: {andQna.andQnaTitle}</h4>
        <p>본문: {andQna.andQnaContent}</p>
        <br />
      </div>
    </div>
  );
};

export default AndQnaDetail;