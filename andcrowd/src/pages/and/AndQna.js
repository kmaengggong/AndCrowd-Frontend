import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AndQna = () => {

    const params = useParams();
    const andId = params.andId;
    const andQnaId = params.andQnaId;
  
    const [andQnaList, setAndQnaList] = useState([]);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch(`/and/${andId}/qna/list`);
        
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
  


return (
    <div>
      <h1>And Qna List</h1>
        <table>
            <thead>
                <tr>
                <th>번호</th>
                <th>제목</th>
                <th>내용</th>
                </tr>
            </thead>
            <tbody>
                {andQnaList.map((andQna) => (
                <tr key={andQna.andQnaId}>
                    <td>{andQna.andQnaId}</td>
                    <td><Link to={`/and/${andId}/qna/${andQna.andQnaId}`}>{andQna.andQnaTitle}</Link></td>
                    <td>{andQna.andQnaContent}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default AndQna;