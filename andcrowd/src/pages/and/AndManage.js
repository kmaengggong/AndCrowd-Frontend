import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AndApplicant from "./AndApplicant";
import axios from "axios";


const AndManage = () => {

    const navigate = useNavigate();
    const params = useParams();
    const andId = params.andId;

    const [andRoleApplyList, setAndRoleApplyList] = useState([]);
    const [andNeedNumApply, setAndNeedNumApply] = useState({});
    const [andMemberList, setMemberList] = useState([]);
    const [andApplicantList, setAndApplicantList] = useState([]);
    const [andApplyStatus, setAndApplyStatus] = useState([]);

    useEffect(() => {
        fetchRoleApplyData();
        fetchNeedNumApplyData();
        fetchMemberData();
        fetchApplicantData();
    }, []);

    const fetchNeedNumApplyData = async () => {
        try {
          const response = await fetch(`/and/${andId}/applicant/neednum`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("fetchNeedNumApplyData: ",data)
            setAndNeedNumApply(data);
          } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
    
        } catch (error) {
          console.error("Error fetching And data:", error);
        }
    };

    const fetchRoleApplyData = async () => {
        try {
          const response = await fetch(`/and/${andId}/role/applicant/count`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("fetchRoleApplyData: ", data)
            setAndRoleApplyList(data);
          } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
    
        } catch (error) {
          console.error("Error fetching And data:", error);
        }
    };

    const fetchMemberData = async () => {
        try {
          const response = await fetch(`/and/${andId}/member/list`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("fetchMemberData: ",data)
            setMemberList(data);
          } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
    
        } catch (error) {
          console.error("Error fetching And data:", error);
        }
    };

    const fetchApplicantData = async () => {
        try {
          const response = await fetch(`/and/${andId}/applicant/list`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("fetchApplicantData: ",data)
            setAndApplicantList(data);
          } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
    
        } catch (error) {
          console.error("Error fetching And data:", error);
        }
    };

    const handleApplyStatusChange = async (updatedStatus, andApplyId) => {
    const updatedStatusValue = parseInt(updatedStatus);
        try {
            const response = await fetch(`/and/${andId}/applicant/${andApplyId}/update/admin`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedStatusValue),
            });

            if (response.ok) {
                await fetchApplicantData();
                await fetchMemberData();
            } else {
                throw new Error(`상태 업데이트 실패. 상태 코드: ${response.status}.`);
            }
        } catch (error) {
            console.error("상태 업데이트 오류:", error);
        }
    };
      
    const deleteAndMember = async (andId, memberId) => {
        try {
          await axios.delete(`/and/${andId}/member/${memberId}/delete`);
          await fetchMemberData();
          await fetchApplicantData();
          console.log("Deleted member with ID:", memberId);
        } catch (error) {
          console.error("error in deleting member:", error);
        }
    };
    
    const applicantDetail = (andApplyId) =>{
        navigate(`/and/${andId}/applicant/${andApplyId}`)
    }

    return(
        <div>
            <h2>{andId}번글 관리 페이지</h2>
            <div>
                <h3>전체 지원 현황</h3>
                    <ul>
                        <li>
                            모임 전체 모집 인원: {andNeedNumApply.totalApplicantNum}
                        </li>
                        <li>
                            모임 전체 지원 인원: {andNeedNumApply.needNumMem}
                        </li>
                    </ul>
            </div>
            <hr />
            <div>
                <h3>역할별 지원 현황</h3>
                {andRoleApplyList.map((andRoleApply) => (
                    <ul>
                        <li>
                            역할번호: {andRoleApply.andRoleId}
                        </li>
                        <li>
                            역할: {andRoleApply.andRole}
                        </li>
                        <li>
                            모집 인원 수: {andRoleApply.andRoleLimit}
                        </li>
                        <li>
                            현재 지원자 수: {andRoleApply.applicantCount}
                        </li>
                    </ul>
                ))}
            </div>
            <hr />
            <div>
                <h3>멤버 관리</h3>
                {andMemberList.map((andMember) => (
                    <ul>
                        <li>
                            멤버 번호: {andMember.memberId}
                        </li>
                        <li>
                            유저 번호: {andMember.userId}
                        </li>
                        <li>
                            삭제여부 : {andMember.deleted ? 'true' : 'false'}
                        </li>
                        <button onClick={() => deleteAndMember(andId, andMember.memberId)}>Delete</button>
                    </ul>
                ))}
            </div>
            <hr />
            <div>
                <h3>지원자 관리</h3>
                {andApplicantList.map((andApplicant) => (
                    <ul>
                        <li>
                            지원번호 : {andApplicant.andApplyId}
                        </li>
                        <li>
                            유저 번호: {andApplicant.userId}
                        </li>
                        <li>
                            역할번호: {andApplicant.andRoleId}
                        </li>
                        <li onClick={() => {applicantDetail(andApplicant.andApplyId)}} style={{ cursor: "pointer" }}>
                            지원서: {andApplicant.andApplyContent}
                        </li>
                        <li>
                            상태코드: {andApplicant.andApplyStatus}
                        </li>
                        <li>
                            <label>상태 변경: </label>
                            <select 
                                value={andApplicant.andApplyStatus} 
                                onChange={(e) => handleApplyStatusChange(e.target.value, andApplicant.andApplyId)}>
                                <option value="0">0 : new</option>
                                <option value="1">1 : 승인</option>
                                <option value="2">2 : 보류</option>
                                <option value="3">3 : 기각</option>
                            </select>
                        </li>

                    </ul>
                ))}
            </div>
        </div>
    );
}

export default AndManage;