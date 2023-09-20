import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Editor from "../../components/and/Editor";
import '../../styles/and/AndCreatePage2.css';
import AndCreateImg from "../../components/and/AndCreateImg";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 
import CrowdCreateImg from "../../components/crowd/CrowdCreateImg";
import CrowdCategoryCreate from "./CrowdCategoryCreate";

const CrowdCreate2 = () => {
    const navigate = useNavigate();
    const params = useParams(); // useParams()를 사용하여 URL 파라미터를 가져옵니다.
    const { crowdId } = params; // andId를 가져옵니다.
    const [userId, setUserId] = useState("");
    const [formData, setFormData] = useState({
        userId: "",
        crowdCategoryId: "",
        crowdTitle: "",
        crowdContent: "",
        crowdEndDate: "",
        crowdGoal: "",
        crowdHeaderImg: ""
    });

    // const yourAccessToken = Cookies.get('refresh_token');

    const fetchData = async () => {
        setUserId(GetUserId());
        
        try {
        const response = await fetch(`/crowd/${crowdId}`);
        if (response.ok) {
            const data = await response.json();
            // 초기 formData를 비우고 새로운 데이터로 업데이트
            setFormData({
                userId: "",
                crowdCategoryId: "",
                crowdTitle: "",
                crowdContent: "",
                crowdEndDate: "",
                crowdGoal: "",
                crowdHeaderImg: ""
            });
            setFormData(data); // 기존 데이터를 모두 할당
        } else {
            throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
        } catch (error) {
        console.error("Error fetching And data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCategoryChange = (event) => {
        const { name, value } = event.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };
    
    const handleDateChange = (event) => {
        const { name, value } = event.target;
    
        // 입력된 날짜 문자열을 Date 객체로 변환
        const date = new Date(value);

        // Date 객체의 시간 부분을 "00:00:00.000000"으로 설정
        date.setUTCHours(0, 0, 0, 0);
    
        // Date 객체를 datetime-local 형식으로 변환
        const formattedDate = `${date.toISOString().slice(0, 16)}`;
    
        setFormData({
            ...formData,
            [name]: formattedDate,
        });
    };

    const handleGoalChange = (event) => {
        const { name, value } = event.target;
        let newValue = value;
        // 만약 입력된 값이 숫자가 아니라면 무시
        if (name === "crowdGoal") {
        // 목표 금액 필드에서는 음수 금액 입력시 0으로 설정
            newValue = Math.max(0, parseFloat(newValue));
        }
        setFormData({
            ...formData,
            [name]: newValue,
        });
        // 모금액이 0원인 경우에만 알림을 표시
        if (name === "crowdGoal" && parseFloat(newValue) === 0) {
        alert("모금액은 0원일 수 없습니다. 다시 입력해주세요.");
        }
    };
    
    const updatedFormData = {
        ...formData,
    };

    const handleNextButtonClick = async () => {
        try {
        const response = await fetch(`/crowd/${crowdId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                crowdTitle: "더미 타이틀",
                crowdContent: "더미 컨텐츠",
                ...updatedFormData,
            }),
        });
        navigate(`/crowd/${crowdId}/create/editor`);
        if (response.ok) {
            const responseData = await response.json();
            const crowdId = responseData;
            navigate(`/crowd/${crowdId}/create/editor`);
        } else {
            throw new Error(`Request failed with status ${response.status}`);
        }
        } catch (error) {
        console.error("Error sending data:", error);
        }
    };

    return (
        <div id='crowd-create2-container'>
        <form  id='crowd-create-form' onSubmit={handleNextButtonClick}>
            <div id='crowd-create2-box'>
                <br />
                <Typography id='crowd-kind-text'>어떤 종류의 모임인가요?</Typography>
                    <CrowdCategoryCreate
                    value={formData.crowdCategoryId}
                    onChange={handleCategoryChange} 
                    />
                <br />
                <Typography id='crowd-date-text'>언제까지 펀딩할 계획인가요?</Typography>
                <div id='crowd-create2-mid'>
                    <input id = 'crowd-create-date' type="date" name="crowdEndDate"  onChange={handleDateChange} placeholder="마감일" required/>
                </div>
                <br />
                <Typography id='crowd-date-text'>목표금액은 얼마인가요?</Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  id="crowdGoal"
                  label="목표 금액"
                  name="crowdGoal"
                  value={formData.crowdGoal}
                  onChange={handleGoalChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <div className="text-primary fw-700">원</div>
                      </InputAdornment>
                    )
                  }}
                />
                <Typography id='crowd-date-text'>대표사진을 첨부해 주세요</Typography>
                <CrowdCreateImg />
            </div>
            <div id="submit-btn-div">
            {/* <button type="submit">저장</button> */}
            <button id='submit-btn' type="button" onClick={handleNextButtonClick}>
                다음
            </button>
            </div>
        </form>
        </div>
    );
};
export default CrowdCreate2;