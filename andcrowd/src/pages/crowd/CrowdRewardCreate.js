import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const CrowdRewardCreate = () => {
  const params = useParams();
  const crowdId = params.crowdId;
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  
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
  
  const handleRewardAdd = () => {
    const newReward = { rewardTitle: reward.rewardTitle, rewardContent: reward.rewardContent, rewardAmount: reward.rewardAmount, rewardLimit: reward.rewardLimit };
    setRewards([...rewards, newReward]);
    setReward({
      rewardTitle: "",
      rewardContent: "",
      rewardAmount: 0,
      rewardLimit: 10,
    });
  };

  const handleRewardDelete = (index) => {
    const updatedRewards = rewards.filter((_, i) => i !== index);
    setRewards(updatedRewards);
  };

  const handleNextButtonClick = async () => {
    // 이 부분에서 rewards를 서버로 전송할 수 있습니다.
    // 서버로 데이터를 전송하는 방식에 따라 수정해야 할 수 있습니다.
    try {
      const response = await fetch(`/crowd/${crowdId}/reward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rewards: rewards,
        }),
      });
      if (response.ok) {
        // 성공적으로 데이터 전송 및 처리되었을 때의 코드
        // 데이터를 저장하고 이동할 경로를 지정합니다.
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        navigate(`/crowd/${crowdId}/img/create`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div>
      <h3>프로젝트 리워드 설계</h3>
      <span>서포터님들에게 제공할 리워드를 입력해 주세요.</span>
      <Box component="form" noValidate sx={{ mt: 3 }}>
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
          <div>
            <h4>입력된 리워드</h4>
            <ul>
              {rewards.map((reward, index) => (
                <li key={index}>
                  <strong>리워드 제목:</strong> {reward.rewardTitle}<br />
                  <strong>리워드 본문:</strong> {reward.rewardContent}<br />
                  <strong>리워드 금액:</strong> {reward.rewardAmount}원<br />
                  <strong>리워드 제한:</strong> {reward.rewardLimit}개<br />
                  <button onClick={() => handleRewardDelete(index)}>리워드 삭제</button>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
        <Container component="main" maxWidth="md">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleNextButtonClick}
          >
            다음
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default CrowdRewardCreate;
