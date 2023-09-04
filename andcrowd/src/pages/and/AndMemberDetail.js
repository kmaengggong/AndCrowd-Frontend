import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const AndMemberDetail = () => {
  const params = useParams();
  const andId = params.andId;
  const memberId = params.memberId;

  const navigate = useNavigate();

  const [andMember, setAndMember] = useState({});

  useEffect(() => {
    fetchData();
  }, [andId,   memberId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/member/${memberId}`);

      if (response.ok) {
        const data = await response.json();
        setAndMember(data);
      } else {
        throw new Error(`Fetching AndMember data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching AndMember data:", error);
    }
  };

  const deleteAndMember = async (andId, memberId) => {
    try {
      await axios.delete(`/and/${andId}/member/${memberId}/delete`);
      console.log("Deleted member with ID:", memberId);
      navigate(`/and/${andId}/member/list`);
    } catch (error) {
      console.error("error in deleting member:", error);
    }
  };

  const updateAndMember = (andId, memberId) => {
    navigate(`/and/${andId}/member/${memberId}/update`);
  };

  if (andMember.deleted === true) {
    alert("이 회원은 삭제되었습니다.");
    window.location.href = `/and/${andId}/member/list`;
  }

  return (
    <div>
      <div>
        <h4>멤버id: {andMember.memberId}</h4>
        <p>유저id: {andMember.userId}</p>
        <br />
        <button onClick={() => deleteAndMember(andMember.andId, andMember.memberId)}>Delete</button>
        <button onClick={() => updateAndMember(andMember.andId, andMember.memberId)}>Update</button>
      </div>
    </div>
  );
};

export default AndMemberDetail;
