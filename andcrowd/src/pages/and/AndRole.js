import React, { useState, useEffect } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import AndToolBar from "../../components/and/AndToolBar";

const AndRole = () => {
  const navigate = useNavigate(); 

  const params = useParams();
  const andId = params.andId;

  const [andRoleList, setAndRoleList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/role/list`);

      if (response.ok) {
        const data = await response.json();
        setAndRoleList(data);
      } else {
        throw new Error(`Fetching AndRole data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching AndRole data:", error);
    }
  };

//   const handleButtonClick = async () => {
//     await fetch(`/and/${andId}/update/status`, {
//       method: "PATCH",
//     });

//     navigate(`/and/list`);
// };


  return (
    <div>
      <AndToolBar andId={andId} />
      <h1>AndRole List</h1>
      <table>
        <thead>
          <tr>
            <th>역할 ID</th>
            <th>역할</th>
            <th>필요인원</th>
          </tr>
        </thead>
        <tbody>
          {andRoleList.map((andRole) => (
            <tr key={andRole.andRoleId}>
              <td>{andRole.andRoleId}</td>
              <td><Link to={`/and/${andId}/role/${andRole.andRoleId}`}>{andRole.andRole}</Link></td>
              <td>{andRole.andRoleLimit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/and/${andId}/role/create`}>역할 추가</Link> <br/>
      <button type="button">
            submit
      </button>
    </div>
  );
};

export default AndRole;
