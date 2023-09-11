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
import { SignUpEmail } from '../../components/sign/SingUpEmail';
import { SignUpAuthNumber } from '../../components/sign/SignUpAuthNumber';
import { SignUpNickname } from '../../components/sign/SignUpNickname';
import { SignUpPassword } from '../../components/sign/SignUpPassword';
import { useNavigate } from 'react-router-dom';
import { SignUpKorName } from '../../components/sign/SignUpKorName';

const defaultTheme = createTheme();

const Signup = () => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [authNumber, setAuthNumber] = useState('');
    const [isAuthNumberValid, setIsAuthNumberValid] = useState(false);

    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);

    const [korName, setKorName] = useState('');

    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isPasswordEqual, setIsPasswordEqual] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [allowTos, setAllowTos] = useState(0);
    const [allowPrivacy, setAllowPrivacy] = useState(0);
    const [allowMarketing, setAllowMarketing] = useState(0);

    const navigate = useNavigate();

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

    const onChangeAllowTos = (event) => {
      event.preventDefault();
      if(event.target.checked) setAllowTos(1);
      else setAllowTos(0);
    }
    const onChangeAllowPrivacy = (event) => {
      event.preventDefault();
      if(event.target.checked) setAllowPrivacy(1);
      else setAllowPrivacy(0);
    }
    const onChangeAllowMarketing = (event) => {
      event.preventDefault();
      if(event.target.checked) setAllowMarketing(1);
      else setAllowMarketing(0);
    }

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
        if(korName === ""){
          alert("이름을 입력해주세요.")
          return;
        }
        if(!isPasswordValid){
          alert("비밀번호를 확인해 주세요.");
          return;
        }
        if(!(allowTos && allowPrivacy)){
          alert("필수 동의 약관에 동의해주세요.");
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
              "userKorName": korName,
              "userPassword": password,
              "userTos": allowTos,
              "userPrivacy": allowPrivacy,
              "userMarketing": allowMarketing
            })
          }).then((res) => {
            console.log(res);
          })
        } catch(error){
          console.error(error);
          alert("회원가입 실패. 다시 시도해주세요.");
        }
        alert("회원가입 완료");
        navigate("/");
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
                <SignUpKorName
                  korName={korName}
                  setKorName={setKorName}
                />
                <SignUpPassword
                  setPassword={setPassword}
                  setPasswordCheck={setPasswordCheck}
                  isPasswordEqual={isPasswordEqual}
                  setIsPasswordValid={setIsPasswordValid}
                />
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowTOS" color="primary" onChange={onChangeAllowTos}/>}
                    label="(필수) 서비스 이용약관 동의"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowPrivacy" color="primary" onChange={onChangeAllowPrivacy} />}
                    label="(필수) 개인정보 동의"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowMarketing" color="primary" onChange={onChangeAllowMarketing} />}
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
