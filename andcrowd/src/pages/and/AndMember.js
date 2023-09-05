import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AndMember = () => {
  const params = useParams();
  const andId = params.andId;
  const [andMemberList, setAndMemberList] = useState([]);
  useEffect(() => {
    fetchData();
  }, [andId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/member/list`);

      if (response.ok) {
        const data = await response.json();
        setAndMemberList(data);
      } else {
        throw new Error(`Fetching AndMember data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching AndMember data:", error);
    }
  };

  return (
    <div>
      <h1>AndMember List</h1>
      <table>
        <thead>
          <tr>
            <th>회원번호</th>
            <th>유저Id</th>
          </tr>
        </thead>
        <tbody>
          {andMemberList.map((andMember) => (
            <tr key={andMember.memberId}>
              <td><Link to={`/and/${andId}/member/${andMember.memberId}`}>{andMember.memberId}</Link></td>
              <td>{andMember.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/and/${andId}/member/create`}>회원 추가</Link>
    </div>
  );
};

export default AndMember;
