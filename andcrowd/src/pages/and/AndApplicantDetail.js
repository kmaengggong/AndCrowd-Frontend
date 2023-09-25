import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../styles/and/AndApplicantDetail.css'

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
    let statusText = '';
    switch (andApplicant.andApplyStatus) {
        case 1:
            statusText = '합격';
            break;
        case 2:
            statusText = '보류';
            break;
        case 3:
            statusText = '탈락';
            break;
        default:
            statusText = '새 글';
            break;
    }

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
      
      // 파일 확장자 추출
      const fileExtension = andApplicant.andApplyFile ? andApplicant.andApplyFile.substring(andApplicant.andApplyFile.lastIndexOf(".")) : "";

    return (
        <>
            <div id='apply-detail-con'>
                <p id='andApplyTitle'>제목: {andApplicant.andApplyTitle}</p>
                <p id='andApplyContent'>신청서: {andApplicant.andApplyContent}</p>
                파일: {andApplicant.andApplyFile && (
                  <a id='open-file' href={andApplicant.andApplyFile} target="_blank" rel="noopener noreferrer"
                  style={{ backgroundColor: 'green', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}                  >
                    {fileExtension} 파일 (새 탭에서 열기)
                  </a>
                )}
                <p id='andApplyStatus'>신청 현황:
                     {statusText}
                </p>
                <br />
                <button id='updateAndApply' onClick={() => updateAndApply(andId, andApplyId)}>update</button>
                <button id=' deleteAndApply'onClick={() => deleteAndApply(andId, andApplyId)}>delete</button>
                <button id='acceptAndApply' onClick={() => acceptAndApply(andId, andApplyId)}>모임장 관리</button>
            </div>
        </>
    );
};
    
export default AndApplicantDetail;