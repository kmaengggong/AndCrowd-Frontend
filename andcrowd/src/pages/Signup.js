import {React, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const Signup = () => {
    const [email, setEmail] = useState('');
    const [authNumber, setAuthNumber] = useState('');
    const [originAuthNumber, setOriginAuthNumber] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [nickname, setNickname] = useState('');

    const onEmailChange = (event) => {
      setEmail(event.currentTarget.value);
    };
    const onAuthNumberChange = (event) => {
      setAuthNumber(event.currentTarget.value);
    };

    const onAuthButtonClick = (event) => {
      event.preventDefault();
      fetch('/mailAuth', {
        method: "POST",
        headers:{
          "Content-Type":"application/json; charset=utf-8"
        },
        body: JSON.stringify({
          "userEmail": email
        })
      }).then((res) => {
        return res.json();
      }).then((data) => {
        setOriginAuthNumber(data);
      });
    };

    const onAuthNumberButtonClick = (event) => {
      event.preventDefault();
      console.log(authNumber);
      console.log(originAuthNumber);
      if(authNumber.match(originAuthNumber)){
        alert("인증 성공!");
        setIsEmailValid(true);
      }
      else{
        alert("인증번호가 틀렸습니다.");
      }
    };

    const onNicknameCheck = (event) => {
      fetch("/")
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              flexDirection: 'column',
              alignItems: 'center',
              ml: 15,
              mr: 15,
            }}
          >
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={onFormSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={10}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="이메일 주소"
                    name="email"
                    autoComplete="email"
                    onChange={onEmailChange}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button
                        className="auth-button"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={onAuthButtonClick}
                    >
                        인증번호
                    </Button>
                </Grid>
                {originAuthNumber === '' ? <></> : <>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      name="auth-number"
                      label="인증번호"
                      type="auth-number"
                      id="auth-number"
                      onChange={onAuthNumberChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 1, mb: 1 }}
                          onClick={onAuthNumberButtonClick}
                      >
                          인증하기
                      </Button>
                  </Grid>
                  </> 
                }
                {!isEmailValid ? <></> : <>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      name="nickname"
                      label="닉네임"
                      type="nickname"
                      id="nickname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 1, mb: 1 }}
                          onClick={onNicknameCheck}
                      >
                          중복확인
                      </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="비밀번호"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="비밀번호 확인 아직 미구현"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  {/* 전화번호 인증, 이메일 인증, 한국 이름, 닉네임, 이메일, 비밀번호, 개인정보 동의, TOS 동의*/}
                  <Grid item xs={12}>

                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" />}
                      label="I want to receive inspiration, marketing promotions and updates via email."
                    />
                  </Grid>
                </>
              }
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                가입하기
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/login" variant="body2">
                    로그인
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
};

export default Signup;
