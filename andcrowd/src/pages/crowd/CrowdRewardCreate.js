import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

const CrowdRewardCreate = ({ onRewardAdd }) => {
  const params = useParams();
  const crowdId = params.crowdId;
  
  const [reward, setReward] = useState({
    rewardTitle: "",
    rewardContent: "",
    rewardAmount: 0,
    rewardLimit: 10,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
  
    if (name === "rewardAmount") {
      // 리워드 금액 필드에서 음수 값이 입력되지 않도록 조치
      newValue = Math.max(0, parseFloat(newValue));
    }
  
    setReward({ ...reward, [name]: newValue });
  };
  

  const [errorMessage, setErrorMessage] = useState("");

  const handleRewardAdd = async () => {
    if (reward.rewardTitle && reward.rewardContent && reward.rewardAmount >= 0 && reward.rewardLimit >= 0) {
      onRewardAdd(reward);
      setReward({
        rewardTitle: "",
        rewardContent: "",
        rewardAmount: 1000,
        rewardLimit: 10,
      });
      setErrorMessage("");
  
      // 리워드 생성 요청을 서버로 보냄
      try {
        const response = await fetch(`/crowd/${crowdId}/reward`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reward),
        });
        if (response.ok) {
          // 리워드가 성공적으로 생성되었을 때의 처리
          // 필요한 경우 추가적인 작업 수행
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error sending reward data:", error);
      }
    } else {
      setErrorMessage("모든 필드를 올바르게 입력하세요.");
    }
  };
  

  return (
    <div>
      <h3>프로젝트 리워드 설계</h3>
      <span>서포터님들에게 제공할 리워드를 입력해 주세요.</span>
      <Grid>
        <TextField
          required
          name="rewardTitle"
          label="리워드 제목"
          fullWidth
          value={reward.rewardTitle}
          onChange={handleInputChange}
        />
        <TextField
          required
          name="rewardContent"
          label="리워드 본문"
          fullWidth
          value={reward.rewardContent}
          onChange={handleInputChange}
        />
        <TextField
          required
          name="rewardAmount"
          label="리워드 금액"
          fullWidth
          type="number"
          value={reward.rewardAmount}
          onChange={handleInputChange}
        />
        <TextField
          required
          name="rewardLimit"
          label="리워드 제한"
          fullWidth
          type="number"
          value={reward.rewardLimit}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleRewardAdd}>
          리워드 추가
        </Button>
        {errorMessage && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}
      </Grid>
    </div>
  );
};

export default CrowdRewardCreate;
