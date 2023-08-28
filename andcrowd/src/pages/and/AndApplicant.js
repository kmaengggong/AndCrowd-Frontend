import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AndApplicant = () => {

    const params = useParams();
    const andId = params.andId;
  
    const [andApplicantList, setAndApplicantList] = useState([]);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch(`/and/${andId}/applicant/list`);
        
        if (response.ok) {
          const data = await response.json();
          setAndApplicantList(data);
        } else {
          throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
  
      } catch (error) {
        console.error("Error fetching And data:", error);
      }
    };
  


return (
    <div>
      <h1>And Applicant List</h1>
        <table>
            <thead>
                <tr>
                <th>신청번호</th>
                <th>회원번호</th>
                <th>역할번호</th>
                <th>신청내용</th>
                </tr>
            </thead>
            <tbody>
                {andApplicantList.map((andApply) => (
                <tr key={andApply.andApplyId}>
                    <td>{andApply.andApplyId}</td>
                    <td>{andApply.userId}</td>
                    <td>{andApply.andRoleId}</td>
                    <td><Link to={`/and/${andId}/applicant/${andApply.andApplyId}`}>{andApply.andApplyContent}</Link></td>
                </tr>
                ))}
            </tbody>
        </table>
        <Link to={`/and/${andId}/applicant/create`}>신청서 작성</Link>
    </div>
    );
};

export default AndApplicant;