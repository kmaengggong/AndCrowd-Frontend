import {createContext, useContext, useState} from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../styles/Login.css';
import { isLoginContext } from '../../context/isLoginContext';
import NaverLogin from '../../components/sign/NaverLogin';
import { useCookies } from 'react-cookie';

const defaultTheme = createTheme();

const Login = () => {
  
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  //   fetch('/login', {
  //     method: "POST",
  //     headers:{
  //       "Content-Type":"application/json; charset=utf-8"
  //     },
  //     body: JSON.stringify({
  //       "userEmail": data.get('email'),
  //       "userPassword": data.get('password')
  //     }) 
  //   }).then(res => {
  //     console.log(res);
  //     if(res.status !== 200){
  //       alert("로그인 실패");
  //       return;
  //     }
  //     alert("로그인 성공!!!!!!!!!!!!");
  //     return res.json();
  //   }).then(data => console.log(data));
  // };

  // return (
  //   <ThemeProvider theme={defaultTheme}>
  //     <Container component="main" maxWidth="xs">
  //       <CssBaseline />
  //       <Box
  //         sx={{
  //           marginTop: 5,
  //           display: 'flex',
  //           flexDirection: 'column',
  //           alignItems: 'center',
  //         }}
  //       >
  //         {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
  //           <LockOutlinedIcon />
  //         </Avatar> */}
  //         <Typography component="h1" variant="h5" sx={{mb: 1}}>
  //           소셜 로그인
  //         </Typography>
  //         <NaverLogin />
  //         <Typography component="h1" variant="h5" sx={{mt: 5}}>
  //           이메일로 로그인
  //         </Typography>
  //         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
  //           <TextField
  //             margin="normal"
  //             required
  //             fullWidth
  //             id="email"
  //             label="이메일 주소"
  //             name="email"
  //             autoComplete="email"
  //             autoFocus
  //           />
  //           <TextField
  //             margin="normal"
  //             required
  //             fullWidth
  //             name="password"
  //             label="비밀번호"
  //             type="password"
  //             id="password"
  //             autoComplete="current-password"
  //           />
  //           <Button
  //             type="submit"
  //             fullWidth
  //             variant="contained"
  //             sx={{ mt: 3, mb: 2 }}
  //           >
  //             로그인
  //           </Button>
  //           <Grid container>
  //             <Grid item xs>
  //               <Link href="#" variant="body2">
  //                 비밀번호 분실
  //               </Link>
  //             </Grid>
  //             <Grid item xs>
  //               <Link href="#" variant="body2">
  //                 회원가입
  //               </Link>
  //             </Grid>
  //           </Grid>
  //         </Box>
  //       </Box>
  //     </Container>
  //   </ThemeProvider>
  // );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const NAVER_CLIENT_ID = "VuPedkCMX9rG5c9njrEN";
    const REDIRECT_URI = "http://localhost:3000/";
    const STATE = false;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
    const navigate = useNavigate();
    const {isLogin, setIsLogin} = useContext(isLoginContext);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onClickNaverLoginButton = () => {
      window.location.href = NAVER_AUTH_URL;
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
          navigate(-1);
        })
      } catch(error){
        console.log(error);
      }
    }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          
          <Typography id='login-text'>
            로그인
          </Typography>
          <Box id='form-box' component="form" noValidate sx={{ mt: 1 }}>
            <TextField className="login"
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="이메일을 입력해주세요"
              name="email"
              autoComplete="email"
              onChange={onChangeEmail}
              autoFocus
            />
            <TextField className="login"
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="비밀번호를 입력해주세요"
              type="password"
              id="password"
              onChange={onChangePassword}
              autoComplete="current-password"
            />
            <Link id='find-login-info' href="#" variant="body2">
                  로그인 정보를 잊으셨나요?
            </Link>
            <Button id='login-button' type="button" onClick={onClickLoginButton}>
              로그인
            </Button>
            <NaverLogin />
            <Grid container id='signup-container'>
              <Grid item xs>
              <Typography id='signup-text'>
              &Crowd가 처음이신가요?
              </Typography>
            
              </Grid>
              <Grid item xs>
              <Link id='to-signup'href="/signup" variant="body2">
                  회원가입
              </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;