import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from '@mui/material/CssBaseline';
import { NumericFormat } from 'react-number-format';
import { InputAdornment } from '@mui/material';
import Cookies from 'js-cookie';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CrowdRewardCreate from '../crowd/CrowdRewardCreate';

const CrowdCreate = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);

  const [formData, setFormData] = useState({
    crowdCategoryId: "",
    crowdTitle: "",
    crowdContent: "",
    crowdGoal: "",
    crowdEndDate: ""
  })

  // endDate를 업데이트하는 함수
  const handleEndDateChange = (newValue) => {
    // setValue(newValue);
    setFormData({
      ...formData,
      crowdEndDate: newValue.toISOString(), // 날짜를 ISO 문자열로 변환하여 crowdEndDate 필드에 업데이트
    });
  };

  const [value, setValue] = React.useState(null);
  const userAccessToken = Cookies.get('refresh_token');
  const [userId, setUserId] = useState(""); // userId를 상태로 설정
  // userId를 백엔드로부터 가져오는 로직
  // 토큰 또는 세션을 이용해 userId를 전달
  const fetchUserId = async () => {
    try{
      const userResponse = await fetch(`/user-info/userid`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (userResponse.ok) {
        const userIdData = await userResponse.json();
        setUserId(userIdData.userId);
      } else {
        throw new Error(`Fetching userId failed with status ${userResponse.status}.`);
      }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  };

  useEffect(() => {
    fetchUserId();
  },[]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updatedFormData = {
    ...formData,
    userId: userId,
  }

  const handleNextButtonClick = async () => {
    try {
      const response = await fetch("/crowd/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      if (response.ok) {
        // 성공적으로 데이터 전송 및 처리되었을 때의 코드
        // 데이터를 저장하고 이동할 경로를 지정합니다.
        const responseData = await response.json();
        const crowdId = responseData; // 응답 데이터에서 andId 값을 추출
        console.log("Created crowdId:", crowdId);
        navigate(`/crowd/${crowdId}/img/create`);//, { state: { formData: updatedFormData }});
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleRewardAdd = (newReward) => {
    setRewards([...rewards, newReward]);
  };

  const handleUploadCancel = () => {
    alert("작성이 취소되었습니다.");
    navigate('/crowd/list'); // 업로드 취소 버튼 클릭 시 페이지 전환
  };

  return ( // 화면단 입력 구문 시작
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              ml: 5,
              mr: 5
            }}
      >
        <Typography component="h1" variant="h5" style={{ lineHeight: '2' }}>
        우리의 꿈과 열정을 함께 나누어주세요 🌟<br />
        여러분의 따뜻한 지원과 사랑으로 이 프로젝트를 실현하고자 합니다.<br />
        함께하는 모든 순간이 소중하고, 우리의 미래에 희망을 안겨줄 것입니다.<br />
        감사함과 함께, 함께하는 여정을 시작해봅시다!
        </Typography>
        <Box component="form" noValidate onSubmit={handleNextButtonClick} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField 
                  required
                  fullWidth
                  id="userId"
                  label="회원번호"
                  name="userId"
                  value={userId} // userId 상태를 TextField의 value로 설정
                  InputProps={{
                    readOnly: true,
                  }}
                />
                {/* <input type="text" name="userId" value={userId} readOnly /> */}
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField 
                  required
                  fullWidth
                  id="crowdCategoryId"
                  label="카테고리 설정"
                  name="crowdCategoryId"
                  select
                  value={formData.crowdCategoryId}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">--카테고리 선택--</MenuItem>
                  <MenuItem value="1">카테고리 1</MenuItem>
                  <MenuItem value="2">카테고리 2</MenuItem>
                  <MenuItem value="3">카테고리 3</MenuItem>
                  <MenuItem value="4">카테고리 4</MenuItem>
                  <MenuItem value="5">카테고리 5</MenuItem>
                  <MenuItem value="6">카테고리 6</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField 
                  required
                  fullWidth
                  id="crowdTitle"
                  label="펀딩 제목"
                  name="crowdTitle"
                  value={formData.crowdTitle}
                  onChange={handleInputChange}
                  placeholder="제목을 입력하세요"
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField 
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="crowdContent"
                  label="펀딩 본문"
                  name="crowdContent"
                  value={formData.crowdContent}
                  onChange={handleInputChange}
                  placeholder="예) OOO한 내용을 기획/개발해 &Crowd에 최초 공개하고자 합니다."
                />
              </Grid>
              {/* 마감일자 선택 */}
              <Grid item xs={12} sm={9}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={formData.crowdEndDate} onChange={handleEndDateChange} />
                    </DemoContainer>
                </LocalizationProvider>
              </Grid>
              {/* 목표금액 설정구문 */}
              <Grid item xs={12} sm={9}>
                <NumericFormat
                  label="목표 금액"
                  customInput={TextField}
                  thousandSeparator={true}
                  fullWidth
                  value={formData.crowdGoal}
                  InputProps={{
                      endAdornment: (
                          <InputAdornment position="end">
                              <div className="text-primary fw-700">원</div>
                          </InputAdornment>
                      )
                  }}
                  helperText={
                    <>
                        This field is required. Only letters and numbers
                        are allowed.
                        <br />
                        Space is not allowed at start. Special
                        characters are not allowed.
                    </>
                  }
                />
              </Grid>
              {/* 리워드 설정 */}
              <Grid item xs={12} sm={9}>
                {/* 리워드 설정 버튼  */}
                <h3>프로젝트 리워드 설계</h3>
                <span>서포터님들에게 제공할 리워드를 입력해 주세요.</span>
                <CrowdRewardCreate onRewardAdd={handleRewardAdd} />
                <div>
                  <h4>입력된 리워드</h4>
                  <ul>
                    {rewards.map((reward, index) => (
                      <li key={index}>
                        <strong>리워드 제목:</strong> {reward.rewardTitle}<br />
                        <strong>리워드 본문:</strong> {reward.rewardContent}<br />
                        <strong>리워드 금액:</strong> {reward.rewardAmount}원<br />
                        <strong>리워드 제한:</strong> {reward.rewardLimit}개<br />
                      </li>
                    ))}
                  </ul>
                </div>
              </Grid>
              <Container component="main" maxWidth="md">
                <br />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleNextButtonClick}
                >
                  다음
                </Button>
              </Container>
            </Grid>
        </Box>
      </Box>
      <Button
          type="button"
          onClick={handleUploadCancel}
          variant="contained"
          color="inherit"
        >
          업로드 취소
      </Button>
    </Container>
  );
};

export default CrowdCreate;
