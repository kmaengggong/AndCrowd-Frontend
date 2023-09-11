import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { NumericFormat } from 'react-number-format';
import InputAdornment from '@mui/material/InputAdornment'; 
import { Container } from "@mui/material";

const CrowdRewardCreate = ({ onRewardAdd }) => {
  const [reward, setReward] = useState({
    rewardTitle: "",
    rewardContent: "",
    rewardAmount: 0,
    rewardLimit: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReward({ ...reward, [name]: value });
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleRewardAdd = () => {
    onRewardAdd(reward);
    setReward({
      rewardTitle: "",
      rewardContent: "",
      rewardAmount: 0,
      rewardLimit: 10,
    });
  };

  return (
    <Card>
      <CardContent>
        <TextField
          name="rewardTitle"
          label="리워드 제목"
          fullWidth
          value={reward.rewardTitle}
          onChange={handleInputChange}
        />
        <br/>
        <TextField
          name="rewardContent"
          label="리워드 본문"
          fullWidth
          value={reward.rewardContent}
          onChange={handleInputChange}
        />
        <br/>
        <Grid item xs={12} sm={9}>
            <NumericFormat
            label="리워드 금액"
            customInput={TextField}
            thousandSeparator={true}
            fullWidth
            onValueChange={(values) => {
                const { value, floatValue } = values;
                if (floatValue < 0) {
                  // 음수 값이 입력된 경우 에러 메시지 설정
                  setErrorMessage("금액은 음수일 수 없습니다.");
                } else {
                  // 음수 값이 아닌 경우 에러 메시지 초기화
                  setErrorMessage("");
                }
                setReward({ ...reward, rewardAmount: floatValue });
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <div className="text-primary fw-700">원</div>
                    </InputAdornment>
                )
            }}
            />
        </Grid>
        {errorMessage && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}
        <TextField
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
      </CardContent>
    </Card>
  );
}

export default CrowdRewardCreate;
