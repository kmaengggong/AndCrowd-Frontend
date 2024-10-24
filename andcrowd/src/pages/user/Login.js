// 로그인 페이지

import { useContext, useState} from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../../styles/Login.css';
import { isLoginContext } from '../../context/isLoginContext';
import { Stack } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {isLogin, setIsLogin} = useContext(isLoginContext);
    const navigate = useNavigate();
    
    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onClickLoginButton = async () => {
      try{
        await fetch('/login',{
          method: "POST",
          headers:{
            "Content-Type":"application/json; charset=utf-8"
          },
          body: JSON.stringify({
            "userEmail": email,
            "userPassword": password
          })
        }).then(res => {
          if(res.status !== 200){
              alert("이메일 혹은 비밀번호를 확인해주세요.");
              return;
          }
          alert("로그인 성공!!!!!!!!!!!!");
          return res.json();
        }).then(data => {
          localStorage.setItem('access_token', data.accessToken);
          setIsLogin(true);
          navigate("/");
          window.location.reload();
        })
      } catch(error){
        console.log(error);
      }
    }

  return (
    <>
      <Box
         sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={2} maxWidth='sm'>
          <Grid item xs={12} marginY={3}>
          <Typography sx={{fontSize:30, marginTop:5, textAlign:'center', fontWeight:700, color:'gray'}}>로그인</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField className="login"
              required
              fullWidth
              id="email"
              placeholder="이메일을 입력해주세요"
              name="email"
              autoComplete="email"
              onChange={onChangeEmail}
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField className="login"
              required
              fullWidth
              name="password"
              placeholder="비밀번호를 입력해주세요"
              type="password"
              id="password"
              onChange={onChangePassword}
              autoComplete="current-password"
              sx={{mb:5}}
            />
          </Grid>
          <Grid item xs={12} textAlign={'center'} marginTop={3} marginBottom={1}>
            <Link id='find-login-info' href="/findIdOrPassword" variant="body2">
              로그인 정보를 잊으셨나요?
            </Link>
          </Grid>
          <Grid item xs={12} textAlign={'center'}>
            <Button
              id="login-button"
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: '6vh' }}
              onClick={onClickLoginButton}
            >
              로그인
            </Button>
          </Grid>
          <Grid item xs={12} margin={'auto'}>
            <Button fullWidth id='naver-login-button' href="http://223.130.128.246/oauth2/authorization/naver"/>
            {/* <Button href="http://223.130.128.246/oauth2/authorization/google">구글 로그인</Button> */}
          </Grid>

          <Grid item xs={12}>
            <Stack direction={'row'} spacing={2} sx={{float:'right'}}>
              <Typography id='signup-text'>
                &Crowd가 처음이신가요?
              </Typography>
              <Link id='to-signup' href="/signup" variant="body2">
                회원가입
              </Link>
            </Stack>
          </Grid>

        </Grid>
      </Box>
    </>
  );
};

export default Login;