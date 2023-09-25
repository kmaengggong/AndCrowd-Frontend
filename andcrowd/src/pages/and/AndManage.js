import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link} from 'react-router-dom';
import AndApplicant from "./AndApplicant";
import axios from "axios";
import '../../styles/and/AndManage.css'
import { Avatar, Button } from '@mui/material';
const AndManage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const andId = params.andId;
    const [matchedApplicantList, setMatchedApplicantList] = useState([]);
    const [andRoleApplyList, setAndRoleApplyList] = useState([]);
    const [andNeedNumApply, setAndNeedNumApply] = useState({});
    const [andMemberList, setMemberList] = useState([]);
    const [andApplicantList, setAndApplicantList] = useState([]);
    const [andApplyStatus, setAndApplyStatus] = useState([]);
    const [members, setMembers] = useState([]);
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
            const newMatchedApplicantList = data.map((item) => ({
              andRoleId: item.andRoleId,
              andRole: item.andRole,
            }));
            setMatchedApplicantList(newMatchedApplicantList);
          } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
        } catch (error) {
          console.error("Error fetching And data:", error);
        }
    };
    const fetchMemberData = async () => {
        try {
          const response = await fetch(`/and/${andId}/member/list/popup`);
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
    };
    const getAndRoleByAndRoleId = (andRoleId) => {
      const matchedApplicant = matchedApplicantList.find(
        (applicant) => applicant.andRoleId === andRoleId
      );
      return matchedApplicant ? matchedApplicant.andRole : "";
    };
    const onClickRoleAddButton = () => {
      navigate(`/and/${andId}/role/update`)
    };
    return (
        <div id="and-manage">
          <h2>{andId}번글 관리 페이지</h2>
          <div id='man-top'>
            <div id='total-ap-mem'>
              <h3 className="section-title">전체 지원 현황</h3>
              <span id='tot-num'><span id='neednum'>{andNeedNumApply.totalApplicantNum}</span>/{andNeedNumApply.needNumMem}</span>
            </div>
            <div id='role-ap'>
              <h3 className="section-title">역할별 지원 현황</h3>
              {andRoleApplyList.map((andRoleApply) => (
                  <div className="role-apply-item" key={andRoleApply.andRoleId}>
                      <span id='role-nm' className={andRoleApply.applicantCount > andRoleApply.andRoleLimit ? 'red-text' : ''}>
                      #{andRoleApply.andRole} ({andRoleApply.applicantCount} / {andRoleApply.andRoleLimit})
                      </span>
                  </div>
                  ))}
                  <Button sx={{float:'center', mt: 2}} color="success" variant='outlined' onClick={onClickRoleAddButton}>역할 관리</Button>
            </div>
          </div>
            <hr />
            <div id='man-bottom'>
            <div id='mem-manage'>
                <h3 className="section-title">멤버 관리</h3>
                {andMemberList.map((andMember) => (
                    <div className="member-item" key={andMember.memberId}>
                    <div className="member-info">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr:1, width:35, height:36 }} alt="member_img" src={andMember.userProfileImg} />
                    <p id='member'>{andMember.userNickname} ({andMember.userKorName})</p>
                    </div>
                    </div>
                    <button id='mem-del-button' onClick={() => deleteAndMember(andId, andMember.memberId)}>삭제</button>
                    </div>
                ))}
            </div>
            <hr />
            <div id='ap-manage'>
                <h3 className="section-title">지원자 관리</h3>
                {andApplicantList.map((andApplicant) => (
                    <div id = 'ap-man-div'>
                        <span id='applyTitle' onClick={() => {applicantDetail(andApplicant.andApplyId)}}>
                        [ {andApplicant.andApplyTitle} ] #{getAndRoleByAndRoleId(andApplicant.andRoleId)}
                        </span>
                    </div>
                ))}
            </div>
            </div>
        </div>
      );
    }
export default AndManage;