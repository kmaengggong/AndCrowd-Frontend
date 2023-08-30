import {useState} from 'react';
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
import NaverLogin from '../components/NaverLogin';

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
    const navigate = useNavigate();

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onClickLogin = async () => {
      let result;
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
          console.log(res);
          if(res.status !== 200){
              alert("이메일 혹은 비밀번호를 확인해주세요.");
              return;
          }
          alert("로그인 성공!!!!!!!!!!!!");
          return res.json();
        }).then(data => {
          console.log(data);
          result = data;
          //return navigate("/");
        })
      } catch(error){
        console.log(error);
      }

      fetchToken(result);
    }

    const fetchToken = async (data) => {
      try{
        await fetch('/api/token',{
          method: "POST",
          headers:{
            "Content-Type":"application/json; charset=utf-8"
          },
          body: JSON.stringify({
            "refreshToken": data.refreshToken,
          })
        }).then((res) => {
          console.log(res);
          if(res.status !== 200){
            console.log("fuck");
            return;
          }
          console.log(res.json());
        })
      } catch(error){
        console.error(error);
      }
    }

    const NAVER_CLIENT_ID = "VuPedkCMX9rG5c9njrEN";
    const REDIRECT_URI = "http://localhost:3000/";
    const STATE = false;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
    
    const onClickNaverLoginButton = () => {
      window.location.href = NAVER_AUTH_URL;
    }

    return (
      <div>
        <button onClick={onClickNaverLoginButton}>네이버 로그인</button>
        E-mail: <input type="text" value={email} onChange={onChangeEmail} /><br />
        Password: <input type="password" value={password} onChange={onChangePassword} /><br />
        <button type="button" onClick={onClickLogin}>Log In</button>
      </div> 
    );
};

export default Login;