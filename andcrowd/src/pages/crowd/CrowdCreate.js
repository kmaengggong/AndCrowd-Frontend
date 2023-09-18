import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Cookies from 'js-cookie';
import { InputAdornment } from "@mui/material";
import CrowdCategoryCreate from "./CrowdCategoryCreate";

const CrowdCreate = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(""); // userId를 상태로 설정
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    crowdCategoryId: "",
    crowdTitle: "",
    crowdContent: "",
    crowdGoal: 0,
    crowdEndDate: ""
  })

  const userAccessToken = Cookies.get('refresh_token');
  
  // userId를 백엔드로부터 가져오는 로직
  // 토큰 또는 세션을 이용해 userId를 전달
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await fetch(`/user-info/userid`, {
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
  
    fetchUserId(); // 컴포넌트가 마운트될 때 함수를 즉시 호출
  }, [userAccessToken]); // userAccessToken이 변경될 때만 효과를 트리거합니다.  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    // 만약 입력된 값이 숫자가 아니라면 무시
    if (name === "crowdGoal") {
      // 목표 금액 필드에서는 음수 금액 입력시 0으로 설정
      newValue = Math.max(0, parseFloat(newValue));
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
    // 모금액이 0원인 경우에만 알림을 표시
    if (name === "crowdGoal" && parseFloat(newValue) === 0) {
      alert("모금액은 0원일 수 없습니다. 다시 입력해주세요.");
    }
  };

  const handleCategorySelect = (event) => {
    handleInputChange(event);
  };  

  const handleNextButtonClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/crowd/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: userId,
        }),
      });
      if (response.ok) {
        // 성공적으로 데이터 전송 및 처리되었을 때의 코드
        // 데이터를 저장하고 이동할 경로를 지정합니다.
        const responseData = await response.json();
        const crowdId = responseData; // 응답 데이터에서 crowdId 값을 추출
        console.log("Created crowdId:", crowdId);
        navigate(`/crowd/${crowdId}/reward`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleUploadCancel = () => {
    alert("업로드가 취소되었습니다.");
    navigate(`/crowd/list`);
  }

  // 모금액 필드의 유효성 검사를 추가
  const isCrowdGoalValid = formData.crowdGoal !== "" && formData.crowdGoal >= 0;

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
        <Box component="form" noValidate sx={{ mt: 3 }} onClick={handleNextButtonClick}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField 
                required
                fullWidth
                id="userId"
                label="회원번호"
                name="userId"
                value={userId} 
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {/* 카테고리 선택 */}
            <CrowdCategoryCreate 
            value={formData.crowdCategoryId} 
            onChange={handleCategorySelect} />
            {/*  */}
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
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  id="crowdEndDate"
                  label="펀딩 마감 일자"
                  name="crowdEndDate"
                  value={formData.crowdEndDate}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* 목표금액 설정구문 */}
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  id="crowdGoal"
                  label="목표 금액"
                  name="crowdGoal"
                  value={formData.crowdGoal}
                  onChange={handleInputChange}
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
          </Grid>
          <hr />
          <Container component="main" maxWidth="md">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isCrowdGoalValid}
              >
                다음
              </Button>
            </Container>
        </Box>
        <Container component="main" maxWidth="md">
          <Button
            type="button"
            onClick={handleUploadCancel}
            variant="contained"
            color="inherit"
          >
            업로드 취소
          </Button>
        </Container>
      </Box>
    </Container>
  );
};

export default CrowdCreate;