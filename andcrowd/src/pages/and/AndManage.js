import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AndApplicant from "./AndApplicant";
import axios from "axios";
import '../../styles/and/AndManage.css'

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

    return (
        <div id="and-manage">
          <h2>{andId}번글 관리 페이지</h2>
          <div id='man-top'>
          <div id='total-ap-mem'>
            <h3 className="section-title">전체 지원 현황</h3>
            <ul>
              <li>
              {andNeedNumApply.totalApplicantNum}/{andNeedNumApply.needNumMem}
              </li>
            </ul>
          </div>
          <hr />
          <div id='role-ap'>
            <h3 className="section-title">역할별 지원 현황</h3>
            {andRoleApplyList.map((andRoleApply) => (
              <ul className="role-apply-item" key={andRoleApply.andRoleId}>
              <li>
                {andRoleApply.andRole} |
              </li>
              <li>
                ( {andRoleApply.applicantCount} / {andRoleApply.andRoleLimit} )
              </li>
            </ul>
            ))}
          </div>
          </div>
            <hr />
            <div id='man-bottom'>
            <div id='mem-manage'>
                <h3>멤버 관리</h3>
                {andMemberList.map((andMember) => (
                    <div className="member-item" key={andMember.memberId}>
                    <div className="member-info">
                        <span id='mem-num'>멤버 번호: {andMember.memberId} </span>
                        <span id='user-num'> 유저 번호: {andMember.userId}   </span>
                    </div>
                    <button onClick={() => deleteAndMember(andId, andMember.memberId)}>삭제</button>
                    </div>
                ))}
            </div>
            <hr />
            <div id='ap-manage'>
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
        </div>
      );
    }

export default AndManage;