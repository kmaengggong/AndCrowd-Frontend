import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AndRoleDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const andRoleId = params.andRoleId;

  const navigate = useNavigate();
  const [andRole, setAndRole] = useState({});

  useEffect(() => {
    fetchData();
  }, [andId, andRoleId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/role/${andRoleId}`);

      if (response.ok) {
        const data = await response.json();
        setAndRole(data);
      } else {
        throw new Error(`Fetching and role data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching And role data:", error);
    }
  };

  const deleteAndRole = async (andId, andRoleId) => {
    try {
      await axios.delete(`/and/${andId}/role/${andRoleId}/delete`);
      console.log("Deleted role with ID:", andRoleId);
      navigate(`/and/${andId}/role/list`);
    } catch (error) {
      console.error("Error in deleting role:", error);
    }
  };

  const updateAndRole = (andId, andRoleId) => {
    navigate(`/and/${andId}/role/${andRoleId}/update`);
  };

  if (andRole.deleted === true) {
    alert("이 역할은 삭제되었습니다.");
    navigate(`/and/${andId}/role/list`);
  }

  return (
    <div>
      <div> 
        <h4>역할: {andRole.andRole}</h4>
        <p>역할 제한: {andRole.andRoleLimit}</p>
        <br />
        <button onClick={() => deleteAndRole(andId, andRoleId)}>Delete</button>
        <button onClick={() => updateAndRole(andId, andRoleId)}>Update</button>
      </div>
    </div>
  );
};

export default AndRoleDetail;
