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

  const manageAnd = (andId) => {
    navigate(`/and/${andId}/manage`);
  };


  const applyAnd = (andId) => {
    navigate(`/and/${andId}/applicant/create`);
  };

  const applicantList = (andId) => {
    navigate(`/and/${andId}/applicant/list`);
  };

  const andChat = (andId) => {
    
    navigate(`/and/${andId}/chat`);
  };

  if (and.deleted === true) {
    alert("이 글은 삭제되었습니다.");
    window.location.href = `/and/list`;

  };

  return (
    <div>
      <div> 
        <h4>제목: {and.andTitle}</h4>
        <p>본문: {and.andContent}</p>
        <p>마감일: {and.andEndDate}</p>
        <img 
          src={and.andHeaderImg}
          width={300}
        />
        <p>상태 코드: {and.andStatus}</p>
        <button onClick={() => updateAnd(and.andId)}>edit</button>
        <button onClick={() => deleteAnd(and.andId)}>delete</button>
        <br />
        <button onClick={() => applyAnd(and.andId)}>apply</button>
        <button onClick={() => applicantList(and.andId)}>apply List</button>
        <br />
        <button onClick={() => andChat(and.andId)}>CHAT</button>
        <br />
        <button onClick={() => manageAnd(and.andId)}>모임 관리</button>
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
        <Link to={`/and/${and.andId}/role/list`}>
        <button>role</button>
        </Link>
      </div>
    </div>
  );
};

export default AndDetail;
