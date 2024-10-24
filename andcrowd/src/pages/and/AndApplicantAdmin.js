import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../styles/and/AndApplicantDetail.css'
const AndApplicantAdmin = () => {
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
          navigate("/NotFound");
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
    const handleApplyStatusChange = async (updatedStatus) => {
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
          navigate(`/and/${andId}/manage`);
        } else {
          throw new Error(`상태 업데이트 실패. 상태 코드: ${response.status}.`);
        }
      } catch (error) {
        console.error("상태 업데이트 오류:", error);
      }
    };
    const fileExtension = andApplicant.andApplyFile ? andApplicant.andApplyFile.substring(andApplicant.andApplyFile.lastIndexOf(".")) : "";      
    

    return (
        <div id='ap-cont'>
            <div>
            <p id='andApplyStatus'>글 상태: {statusText}</p>
            <p id='andApplyTitle'>{andApplicant.andApplyTitle}</p>
           
          <div id='andApplyContent' dangerouslySetInnerHTML={{ __html :  andApplicant.andApplyContent  }}>
          </div>
          
            
            </div>
            <hr />
            <div id='ap-lef'>
            {andApplicant.andApplyFile && (
              <div >
                <a id='open-file' href={andApplicant.andApplyFile} target="_blank" rel="noopener noreferrer"
                  style={{  padding: '10px 20px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {fileExtension} 파일 (새 탭에서 열기)
                </a>
              </div>
            )}
              <label>상태 변경: </label>
              <select value={andApplyStatus} onChange={(e) => handleApplyStatusChange(e.target.value)}>
              <option value="">선택하세요</option>
                <option value="1">승인</option>
                <option value="2">보류</option>
                <option value="3">기각</option>
              </select>
          </div>

        </div>
    );
};
    
export default AndApplicantAdmin;