import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/crowd/CrowdCreate.css';
import { Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 

const CrowdCreate1 = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        crowdCategoryId: "",
        crowdTitle: "",
        crowdContent: "",
        crowdEndDate: "",
        crowdGoal: "",
        crowdHeaderImg: ""
    });
    const [userId, setUserId] = useState("");
    const [userAnd, setUserAnd] = useState([]);
    const [andId, setAndId] = useState('');

    useEffect(() => {
        const fetchUserCrowdData = async () => {
            try{
                const userId = GetUserId();
                const response = await fetch(`/user/${userId}/maker/0`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUserAnd(data);
                } else {
                    throw new Error(`Fetching data failed with status ${response.status}.`);
                }
            }
            catch (error) {
            console.error("Error fetching data:", error);
            }

        }  
        setUserId(GetUserId());
        fetchUserCrowdData();
    }, []);
    useEffect(() => {
        console.log(userAnd);
    }, [userAnd]);

    const updatedFormData = {
        ...formData,
        userId: userId,
        andId: andId,
    };  
  
    const handleNextButtonClick = async () => {
        try {
            const response = await fetch("/crowd/create", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...updatedFormData,
                    crowdCategoryId: 999,
                    crowdTitle: "Temporary Title",
                    crowdContent: "Temporary Content",
                    crowdEndDate: "2099-12-12T12:00:00",
                    crowdGoal: 0,
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                const crowdId = responseData;
                console.log("Created crowdId:", crowdId);
                navigate(`/crowd/${crowdId}/create2`);
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
        console.error("Error sending data:", error);
        }
    };

    const handleAndId = (event) => {
        event.preventDefault();
        setAndId(Number(event.currentTarget.value));
    }
    
    return (
        <div>
        <Typography>연결된 모임이 있으면 아래에 옵션에서 선택해주세요</Typography>
        <div >
            <div>
            <select
                name='userAnd'
                value={andId}
                onChange={handleAndId}
            >
                <option value="">없음</option>
                {userAnd.map((and) => (
                <option key={and.andId} value={and.andId}>
                    [{and.andId}] {and.andTitle}
                </option>
                ))}
            </select>

            </div>
            
            <button id='first-submit-btn' type="button" onClick={handleNextButtonClick}>
            다음
            </button>
        </div>
        
        </div>
    );
};

export default CrowdCreate1;