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
          marginTop: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={2} maxWidth='sm'>
          <Grid item xs={12} marginY={3}>
            <Typography id='login-text' textAlign={'center'}>
              로그인
            </Typography>
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
            />
          </Grid>
          <Grid item xs={12} textAlign={'center'} marginTop={3}>
            <Link id='find-login-info' href="/findIdOrPassword" variant="body2">
              로그인 정보를 잊으셨나요?
            </Link>
          </Grid>
          <Grid item xs={12} textAlign={'center'} margin={'auto'}>
            <Button
              id="login-button"
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mb: 2, maxWidth: 500}}
              onClick={onClickLoginButton}
            >
              로그인
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button href="http://223.130.128.246/oauth2/authorization/naver">네이버 로그인</Button>
            <Button href="http://223.130.128.246/oauth2/authorization/google">구글 로그인</Button>
          </Grid>

          <Grid item xs={12} marginY={5}>
            <Stack direction={'row'} spacing={2}>
              <Typography id='signup-text' textAlign={'center'}>
                &Crowd가 처음이신가요?
              </Typography>
              <Link id='to-signup' href="/signup" variant="body2" textAlign={'center'}>
                회원가입
              </Link>
            </Stack>
          </Grid>

        </Grid>
      </Box>
      {/* <Container component="main" maxWidth="xs"> */}
        {/* <CssBaseline /> */}
        {/* <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grid container spacing={2} maxWidth={'sm'}>
          <Typography id='login-text'>
            로그인
          </Typography>
          
          <Grid item xs={12}>
          <Box id='form-box' component="form" noValidate sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
            <Link id='find-login-info' href="#" variant="body2">
                  로그인 정보를 잊으셨나요?
            </Link>
            </Grid>
            <Grid item xs={12}>
            <Button id='login-button' type="button" onClick={onClickLoginButton}>
              로그인
            </Button>
            </Grid>
            <NaverLogin />
            <button onClick={onClickNaverLoginButton}>ㅁㄴㅇㄹ</button>
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
          </Grid>
          </Grid>
        </Box> */}
      {/* </Container> */}
    {/* </ThemeProvider> */}
    </>
  );
};

export default Login;