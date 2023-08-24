import React, { useState, useEffect } from "react";
import { redirect, useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


const AndDetail = () => {
  const params = useParams();
  const andId = params.andId;

  const navigate = useNavigate();

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

  const updateAnd = (andId) => {
    navigate(`/and/${andId}/update`);
  };

  const deleteAnd = async (andId) => {
    try {
      await axios.delete(`/and/${andId}/delete`);
      console.log("Deleted and with ID:", andId);
      navigate(`/and/list`);
    } catch (error) {
      console.error("error in deleting and:", error);
    }
  };


  return (
    <div>
      <div> 
        <h4>제목: {and.andTitle}</h4>
        <p>본문: {and.andContent}</p>
        <p>마감일: {and.andEndDate}</p>
        <button onClick={() => updateAnd(and.andId)}>edit</button>
        <button onClick={() => deleteAnd(and.andId)}>delete</button>
        <br />
        <br />
        <hr />
        <br />
      </div>
      <div>
      <Link to={`/and/${and.andId}/qna/list`}>
        <button>qna</button>
        </Link>
        <Link to={`/and/${and.andId}/board/list`}>
        <button>board</button>
        </Link>
      </div>
    </div>
  );
};

export default AndDetail;