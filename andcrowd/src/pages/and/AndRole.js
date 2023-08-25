import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const AndRole = () => {
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

  return (
    <div>
      <h1>AndRole List</h1>
      <table>
        <thead>
          <tr>
            <th>역할 ID</th>
            <th>And ID</th>
            <th>역할</th>
            <th>역할 제한</th>
          </tr>
        </thead>
        <tbody>
          {andRoleList.map((andRole) => (
            <tr key={andRole.andRoleId}>
              <td>{andRole.andRoleId}</td>
              <td>{andRole.andId}</td>
              <td><Link to={`/and/${andId}/role/${andRole.andRoleId}`}>{andRole.andRole}</Link></td>
              <td>{andRole.andRoleLimit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/and/${andId}/role/create`}>역할 추가</Link>
    </div>
  );
};

export default AndRole;
