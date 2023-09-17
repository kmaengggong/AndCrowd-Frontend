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

  // TextField 컴포넌트 생성을 위한 커스텀 함수
  const renderTextField = (name, label, type = "text") => (
    <TextField
      required
      name={name}
      label={label}
      fullWidth
      type={type}
      value={reward[name]}
      onChange={handleInputChange}
    />
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
  
    if (name === "rewardAmount") {
      newValue = Math.max(0, parseFloat(newValue));
    }
  
    setReward({ ...reward, [name]: newValue });
  };
  
  const handleRewardAdd = () => {
    const newReward = { ...reward };
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

  // 다음 버튼 클릭 핸들러 분리
  const handleNextButtonClick = () => {
    sendDataToServer();
  };

  // 서버로 데이터를 전송하는 함수
  const sendDataToServer = async () => {
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
          {renderTextField("rewardTitle", "리워드 제목")}
          {renderTextField("rewardContent", "리워드 본문")}
          {renderTextField("rewardAmount", "리워드 금액", "number")}
          {renderTextField("rewardLimit", "리워드 수량", "number")}
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
                  <strong>리워드 수량:</strong> {reward.rewardLimit}개<br />
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
