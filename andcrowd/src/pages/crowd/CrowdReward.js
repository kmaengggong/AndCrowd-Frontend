import { Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const CrowdReward = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const rewardId = params.rewardId;
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        fetchData();
    }, [crowdId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/reward/all`);
            if (response.ok) {
              const data = await response.json();
              setRewards(data);
            } else {
              throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
            }
        } catch (error) {
        console.error("Error fetching AndBoard data:", error);
        }
    };

    return(
        <Container>{/* 리워드 상세 정보를 보여주는 버튼 */}
            <ul>
            {rewards.map((reward) => (
                <li key={reward.rewardId}>
                <h4>{reward.rewardAmount}</h4>
                <span>{reward.rewardTitle}</span>
                <span>{reward.rewardContent}</span>
                </li>
                ))}
            </ul>
        </Container>
    );
};

export default CrowdReward;