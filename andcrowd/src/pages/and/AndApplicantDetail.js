import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const AndApplicantDetail = () => {
    const params = useParams();
    const andId = params.andId;
    const andApplyId = params.andApplyId;

    const navigate = useNavigate();

    const [andApplicant, setAndApplicant] = useState({});

    useEffect(() => {
        fetchData();
      }, []);
    
    const fetchData = async () => {
    try {
        const response = await fetch(`/and/${andId}/applicant/${andApplyId}`);
        if (response.ok) {
        const Data = await response.json();
        setAndApplicant(Data);
        } else {
        throw new Error(`Fetching and data failed with status ${Response.status}.`);
        }
    } catch (error) {
        console.error("Error fetching And data:", error);
      }
    };
  

    const deleteAndApply = async (andId, andApplyId) => {
        try {
          await axios.delete(`/and/${andId}/applicant/${andApplyId}/delete`);
          console.log("Deleted and with ID:", andApplyId);
          navigate(`/and/${andId}/applicant/list`);
        } catch (error) {
          console.error("error in deleting and:", error);
        }
      };
    
      const updateAndApply = (andId, andApplyId) => {
        navigate(`/and/${andId}/applicant/${andApplyId}/update`);
      };
    
      const acceptAndApply = (andId, andApplyId) => {
        navigate(`/and/${andId}/applicant/${andApplyId}/admin`);
      };

    return (
        <>
            <div>
                <h4>신청 번호: {andApplicant.andApplyId}</h4>
                <p>회원번호: {andApplicant.userId}</p>
                <p>역할번호: {andApplicant.andRoleId}</p>
                <p>신청서: {andApplicant.andApplyContent}</p>
                <p>신청 현황: {andApplicant.andApplyStatus}</p>
                <p>(0: new / 1: 합격 / 2: 보류 / 3: 탈락)</p>
                <br />
                <button onClick={() => updateAndApply(andId, andApplyId)}>update</button>
                <button onClick={() => deleteAndApply(andId, andApplyId)}>delete</button>
                <button onClick={() => acceptAndApply(andId, andApplyId)}>모임장 관리</button>
            </div>
        </>
    );
};
    
export default AndApplicantDetail;