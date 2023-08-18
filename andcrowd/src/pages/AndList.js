import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

const AndList = () => {
  const [andList, setAndList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/and/list");
      
      if (response.ok) {
        const data = await response.json();
        setAndList(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const editAnd = (andId) => {
    
  };

  const deleteAnd = async (andId) => {
    try {
      await axios.delete(`/and/${andId}/delete`);
      console.log("Deleted and with ID:", andId);
      fetchData(); 
    } catch (error) {
      console.error("deleting and:", error);
    }
  };

  return (
    <div>
      <h1>And List</h1>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {andList.map((and) => (
            <tr key={and.andId}>
              <td>{and.andId}</td>
              <td><Link to={`/and/${and.andId}`}>{and.andTitle}</Link></td>
              <td>{and.andContent}</td>
              <td>
                <button onClick={() => editAnd(and.andId)}>edit</button>
                <button onClick={() => deleteAnd(and.andId)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/and/create">모임글 작성</Link>
    </div>
  );
};

export default AndList;
