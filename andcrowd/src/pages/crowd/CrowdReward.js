import { Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const CrowdReward = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const rewardId = params.rewardId;
    const [rewards, setRewards] = useState([]);

    // useEffect(() => {
    //     fetchData();
    // }, [crowdId]);

    useEffect(() => {
        // 더미 리워드 데이터 생성
        const dummyRewards = [
            {
                rewardId: 1,
                rewardAmount: 1000,
                rewardTitle: "테스트 제목 1",
                rewardContent: "테스트 본문 1",
            },
            {
                rewardId: 2,
                rewardAmount: 5000,
                rewardTitle: "테스트 제목 2",
                rewardContent: "테스트 본문 2",
            },
            // 필요한 만큼 리워드 항목 추가
        ];
        setRewards(dummyRewards); // 더미 데이터를 상태에 설정

    // 리워드 데이터의 금액에 콤마 추가
    const formattedRewards = dummyRewards.map((reward) => ({
        ...reward,
        rewardAmount: reward.rewardAmount.toLocaleString(),
    }));

    setRewards(formattedRewards); // 형식화된 데이터를 상태에 설정
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
                <h4>{reward.rewardAmount} 원</h4>
                <span>{reward.rewardTitle}</span><br />
                <span>{reward.rewardContent}</span>
                </li>
                ))}
                <hr/>
            </ul>
        </Container>
    );
};

export default CrowdReward;