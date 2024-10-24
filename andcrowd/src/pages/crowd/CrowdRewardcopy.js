import { Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const CrowdRewardcopy = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const rewardId = params.rewardId;
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        fetchData(); // 서버에서 데이터를 가져오도록 호출
    }, [crowdId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/reward/all`);
            if (response.ok) {
              const data = await response.json();
              // 가져온 데이터를 상태에 설정
              setRewards(data);
            } else {
              throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Error fetching AndBoard data:", error);
        }
    };

    // 리워드 데이터의 금액에 콤마 추가
    const formattedRewards = rewards.map((reward) => ({
        ...reward,
        rewardAmount: reward.rewardAmount.toLocaleString(),
    }));    

    return (
        <Container>
            <ul>
                {formattedRewards.map((reward) => (
                    <li key={reward.rewardId}>
                        <h4>{reward.rewardAmount} 원</h4>
                        <span>{reward.rewardTitle}</span><br />
                        <span>{reward.rewardContent}</span>
                    </li>
                ))}
                <hr />
            </ul>
        </Container>
    );
};

export default CrowdRewardcopy;
