import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";

const CrowdRewardUpdateCopy = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const rewardId = params.rewardId;
    const navigate = useNavigate();

    const [rewards, setRewards] = useState([]);
    const [reward, setReward] = useState({
        crowdId: crowdId,
        rewardTitle: "",
        rewardContent: "",
        rewardAmount: 0,
        rewardLimit: 0,
    });

    useEffect(() => {
        fetch(`/crowd/${crowdId}/reward/${rewardId}`)
        .then(response => {
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            setReward(data);
        }).catch(error => {
            console.error("Error fetching reward data:", error);
        });
    }, [crowdId, rewardId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value)
        let newValue = value;
      
        if (name === "rewardAmount") {
          newValue = Math.max(0, parseFloat(newValue));
        }
        if (name === "rewardLimit") {
          newValue = Math.max(0, parseFloat(newValue));
        }
      
        setReward({ ...reward, [name]: newValue });
    };

    const handleRewardAdd = () => {
        const newReward = { ...reward };
        if(newReward.rewardTitle.length < 1){
          alert("제목을 설정해주세요.");
          return;
        }
        if(newReward.rewardContent.length < 1){
          alert("내용을 설정해주세요.");
          return;
        }
        if(newReward.rewardAmount < 1){
          alert("금액을 설정해주세요.");
          return;
        }
        if(newReward.rewardLimit < 1){
          alert("한정수량을 선택해주세요.");
          return;
        }
        setRewards([...rewards, newReward]);
        setReward({
          crowdId: crowdId,
          rewardTitle: "",
          rewardContent: "",
          rewardAmount: 0,
          rewardLimit: 0,
        });
    };

    const handleRewardDelete = (index) => {
        const updatedRewards = rewards.filter((_, i) => i !== index);
        setRewards(updatedRewards);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const response = await fetch(`/crowd/${crowdId}/reward/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; text=utf-8",
            },
            body: JSON.stringify(reward),
        }).then(() => {
            alert("리워드가 성공적으로 업데이트되었습니다.");
            navigate(`/crowd/${crowdId}`);
          })
          .catch(error => console.error("Error updating reward:", error));
    }

    return(
        <Box noValidate sx={{ mt: 3 }}>
        <div className="crowd-reward-create-container">
        <h3>프로젝트 리워드 수정</h3>
        <h4>수정할 리워드를 입력해 주세요.</h4>
        <form>
            <div className="form-group">
            <label>리워드명:</label>
            <input
                type="text"
                name="rewardTitle"
                value={reward.rewardTitle}
                onChange={handleInputChange}
                placeholder="리워드명을 입력해주세요"
                required
            />
            </div>
            <div className="form-group">
            <label>리워드 내용:</label>
            <input
                type="text"
                name="rewardContent"
                value={reward.rewardContent}
                onChange={handleInputChange}
                placeholder="리워드 내용을 입력해주세요"
                required
            />
            </div>
            <div className="form-group">
            <label>리워드 금액:</label>
            <input
                type="number"
                name="rewardAmount"
                value={reward.rewardAmount}
                onChange={handleInputChange}
                placeholder="리워드 금액"
                required
            />
            </div>
            <div className="form-group">
            <label>리워드 수량:</label>
            <input
                type="number"
                name="rewardLimit"
                value={reward.rewardLimit}
                onChange={handleInputChange}
                placeholder="리워드 수량"
                required
            />
            </div>
            <div className="form-group" id="button-container">
            <Button variant="contained" color="primary" onClick={handleRewardAdd}>
                리워드 추가
            </Button>
            </div>
        </form>

        <div>
            <h2>추가된 리워드</h2>
            <ul className="reward-role-list">
                {rewards.map((reward, index) => (
                <li key={index}>
                    <strong>리워드 제목:</strong> {reward.rewardTitle}<br />
                    <strong>리워드 본문:</strong> {reward.rewardContent}<br />
                    <strong>리워드 금액:</strong> {reward.rewardAmount}원<br />
                    <strong>리워드 수량:</strong> {reward.rewardLimit}개<br />
                    <button onClick={() => handleRewardDelete(index)}>리워드 삭제</button>
                </li>
                ))}
            </ul>
            </div>
            <button id='role-next-btn' onClick={handleUpdate}>
                다음
            </button>
        </div>
      </Box>
    )
}

export default CrowdRewardUpdateCopy;