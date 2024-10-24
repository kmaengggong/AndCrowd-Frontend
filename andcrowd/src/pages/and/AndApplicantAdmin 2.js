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
    const [andApplyStatus, setAndApplyStatus] = useState([]);


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

    const handleApplyStatusChange = async (updatedStatus) => {
      console.log("상태 변경 함수 호출됨. 선택한 값:", updatedStatus);
      const updatedStatusValue = parseInt(updatedStatus); 
    
      setAndApplyStatus(updatedStatus);
    
      try {
        const response = await fetch(`/and/${andId}/applicant/${andApplyId}/update/admin`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStatusValue),
        });
    
        if (response.ok) {
          navigate(`/and/${andId}/applicant/list`);
        } else {
          throw new Error(`상태 업데이트 실패. 상태 코드: ${response.status}.`);
        }
      } catch (error) {
        console.error("상태 업데이트 오류:", error);
      }
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
            </div>
            <hr />
            <div>
              <label>상태 변경: </label>
              <select value={andApplyStatus} onChange={(e) => handleApplyStatusChange(e.target.value)}>
                <option value="0">0 : new</option>
                <option value="1">1 : 승인</option>
                <option value="2">2 : 보류</option>
                <option value="3">3 : 기각</option>
              </select>
            </div>

        </>
    );
};
    
export default AndApplicantDetail;