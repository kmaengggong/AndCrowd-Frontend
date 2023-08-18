import React, { useState, useEffect } from "react";

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
              <td>{and.andTitle}</td>
              <td>{and.andContent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AndList;