import {React, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SignUpEmail } from '../components/user/SingUpEmail';
import { SignUpAuthNumber } from '../components/user/SignUpAuthNumber';
import { SignUpNickname } from '../components/user/SignUpNickname';
import { SignUpPassword } from '../components/user/SignUpPassword';

const defaultTheme = createTheme();

const Signup = () => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [authNumber, setAuthNumber] = useState('');
    const [isAuthNumberValid, setIsAuthNumberValid] = useState(false);

    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isPasswordEqual, setIsPasswordEqual] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    useEffect(() => {
      if(passwordCheck.match(password)){
        setIsPasswordEqual(true);
      }
      else{
        setIsPasswordEqual(false);
      }
    }, [password, passwordCheck]);

    useEffect(() => {
      if(isPasswordEqual && password.length>0){
        setIsPasswordValid(true);
      }
    }, [isPasswordEqual, password]);

    const onFormSubmit = async (event) => {
        event.preventDefault();
        if(!isEmailValid){
          alert("이메일을 확인해 주세요.");
          return;
        }
        if(!isAuthNumberValid){
          alert("이메일 인증을 다시 해 주세요.");
          return;
        }
        if(!isNicknameValid){
          alert("닉네임을 확인해 주세요.");
          return;
        }
        if(!isPasswordValid){
          alert("비밀번호를 확인해 주세요.");
          return;
        }

        try{
          await fetch('/signup',{
            method: "POST",
            headers:{
              "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
              "userEmail": email,
              "userNickname": nickname,
              "userPassword": password,
            })
          }).then((res) => {
            console.log(res);
          })
        } catch(error){
          console.error(error);
          alert("회원가입 실패. 다시 시도해주세요.");
        }
        console.log(email);
        console.log(nickname);
        console.log(password);
        alert("회원가입 완료");
    };

    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              ml: 5,
              mr: 5
            }}
          >
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={onFormSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <SignUpEmail
                  email={email}
                  setEmail={setEmail}
                  setIsEmailValid={setIsEmailValid}
                  setAuthNumber={setAuthNumber}
                />
                <SignUpAuthNumber
                  authNumber={authNumber}
                  setIsAuthNumberValid={setIsAuthNumberValid}
                />
                <SignUpNickname
                  nickname={nickname}
                  setNickname={setNickname}
                  setIsNicknameValid={setIsNicknameValid}
                />
                <SignUpPassword
                  setPassword={setPassword}
                  setPasswordCheck={setPasswordCheck}
                  isPasswordEqual={isPasswordEqual}
                  setIsPasswordValid={setIsPasswordValid}
                />
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="(필수) 서비스 이용약관 동의"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="(필수) 개인정보 동의"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="(선택) 마케팅 동의"
                  />
                </Grid>
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
