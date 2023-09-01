import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';

const CrowdCreate = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(""); // userId를 상태로 설정

  useEffect(() => {
    // userId를 백엔드로부터 가져오는 로직
    // 토큰 또는 세션을 이용해 userId를 전달
    const fetchUserId = async () => {
      try{
        const response = await fetch("/user");
        if(response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        }else {
          throw new Error(`Fetching userId failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };
    fetchUserId();
  },[]);

  const [formData, setFormData] = useState({
    userId: "",
    crowdCategoryId: "",
    crowdTitle: "",
    crowdContent: "",
    crowdGoal: "",
    crowdReward: "",
    crowdEndDate: "",
    headerImg: "",
    crowdImg1: "",
    crowdImg2: "",
    crowdImg3: "",
    crowdImg4: "",
    crowdImg5: "",
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/crowd/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 성공적으로 데이터 전송 및 처리되었을 때의 코드
        // 데이터를 저장하고 이동할 경로를 지정합니다.
        const responseData = await response.json();
        const crowdId = responseData; // 응답 데이터에서 andId 값을 추출
        console.log("Created crowdId:", crowdId);
        navigate(`/crowd/list`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleUploadCancel = () => {
    navigate('/crowd/list'); // 업로드 취소 버튼 클릭 시 페이지 전환
  };

  // 목표금액 설정  
  const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
    props,
    ref,
  ) {
    const { onChange, ...other } = props;
  
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString 
        prefix="₩"
      />
    );
  });
  
  NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  
  const [values, setValues] = React.useState({
    numberformat: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // 목표금액 필드만 따로 처리
    if (name === 'crowdGoal') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // setValues({
    //   ...values,
    //   [event.target.name]: event.target.value,
    // });
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
      <Typography component="h1" variant="h5">
      우리의 꿈과 열정을 함께 나누어주세요 🌟
      여러분의 따뜻한 지원과 사랑으로 이 프로젝트를 실현하고자 합니다.
      함께하는 모든 순간이 소중하고, 우리의 미래에 희망을 안겨줄 것입니다.
      감사함과 함께, 함께하는 여정을 시작해봅시다!
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField 
                required
                fullWidth
                id="userId"
                label="회원번호"
                name="userId"
                autoComplete="userId"
                aria-readonly="true"
                value={userId} // userId 상태를 TextField의 value로 설정
                onChange={handleInputChange} // 필요한 경우 이벤트 핸들러 추가
              />
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
                maxRows={4}
                id="crowdContent"
                label="펀딩 본문"
                name="crowdContent"
                value={formData.crowdContent}
                onChange={handleInputChange}
                placeholder="예) OOO한 내용을 기획/개발해 &Crowd에 최초 공개하고자 합니다."
              />
            </Grid>
            {/* 목표금액 설정구문 */}
            {/* <Box
              sx={{
                '& > :not(style)': {
                  m: 1,
                },
              }}
            ></Box> */}
            <Grid item xs={12} sm={9}>
              <TextField 
                required
                fullWidth
                id="crowdGoal" // 목표금액 입력 필드의 ID
                label="펀딩 목표 금액" // 목표금액 입력 필드의 라벨
                name="crowdGoal" // 목표금액 입력 필드의 이름
                type="text" // 숫자만 입력 가능하도록 설정
                value={values.numberformat} // 현재 상태의 목표금액 값을 사용
                onChange={handleChange} // 입력값 변경 시 상태 업데이트
                placeholder="목표 금액을 입력하세요."
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
                variant="standard"
              />
            </Grid>
            {/* 이미지 업로드 부분 */}
              <Grid item xs={12} sm={9}>
                <TextField
                  required 
                  fullWidth
                  id="headerImg"
                  label="헤더 이미지"
                  name="headerImg"
                  value={formData.headerImg}
                  onChange={handleInputChange}
                  placeholder="첨부 파일을 업로드 하세요."
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  required 
                  fullWidth
                  id="crowdImg1"
                  label="이미지1"
                  name="crowdImg1"
                  value={formData.crowdImg1}
                  onChange={handleInputChange}
                  placeholder="첨부 파일을 업로드 하세요."
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  required 
                  fullWidth
                  id="crowdImg2"
                  label="이미지2"
                  name="crowdImg2"
                  value={formData.crowdImg2}
                  onChange={handleInputChange}
                  placeholder="첨부 파일을 업로드 하세요."
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField 
                  required
                  fullWidth
                  id="crowdImg3"
                  label="이미지3"
                  name="crowdImg3"
                  value={formData.crowdImg3}
                  onChange={handleInputChange}
                  placeholder="첨부 파일을 업로드 하세요."
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  required 
                  fullWidth
                  id="crowdImg4"
                  label="이미지4"
                  name="crowdImg4"
                  value={formData.crowdImg4}
                  onChange={handleInputChange}
                  placeholder="첨부 파일을 업로드 하세요."
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField 
                  required
                  fullWidth
                  id="crowdImg5"
                  label="이미지5"
                  name="crowdImg5"
                  value={formData.crowdImg5}
                  onChange={handleInputChange}
                  placeholder="첨부 파일을 업로드 하세요."
                />
              </Grid>
            <Container component="main" maxWidth="md">
              <br />
              <Button
                type="button"
                onClick={handleUploadCancel}
                variant="contained"
                color="secondary"
              >
                업로드 취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                업로드
              </Button>
            </Container>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CrowdCreate;
