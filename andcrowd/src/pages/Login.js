import * as React from 'react';
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
import '../styles/Login.css';

const defaultTheme = createTheme();

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    fetch('/login', {
      method: "POST",
      headers:{
        "Content-Type":"application/json; charset=utf-8"
      },
      body: JSON.stringify({
        "userEmail": data.get('email'),
        "userPassword": data.get('password')
      }) 
    }).then(res => {
      console.log(res);
      if(res.status !== 200){
        alert("로그인 실패");
        return;
      }
      alert("로그인 성공!!!!!!!!!!!!");
      return res.json();
    }).then(data => console.log(data));
  };

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
          <Box id='form-box' component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField className="login"
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="이메일을 입력해주세요"
              name="email"
              autoComplete="email"
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
              autoComplete="current-password"
            />
            <Link id='find-login-info' href="#" variant="body2">
                  로그인 정보를 잊으셨나요?
            </Link>
            <Button id='login-button' type="submit">
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
              <Link id='to-signup'href="#" variant="body2">
                  회원가입
              </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const onChangeEmail = (e) => {
    //     setEmail(e.target.value);
    // }
    // const onChangePassword = (e) => {
    //     setPassword(e.target.value);
    // }

    // const onClickLogin = () => {
    //     console.log({email, password});
    //     fetch('/login', {
    //         method: "POST",
    //         headers:{
    //             "Content-Type":"application/json; charset=utf-8"
    //         },
    //         body: JSON.stringify({
    //             "userEmail": email,
    //             "userPassword": password
    //         }) 
    //     }).then(res => {
    //         console.log(res);
    //         if(res.status !== 200){
    //             alert("로그인 실패");
    //             return;

    //         }
    //         alert("로그인 성공!!!!!!!!!!!!");
    //         return res.json();
    //     }).then(data => console.log(data));
    // }

    // return (
    //   <div>
    //     E-mail: <input type="text" value={email} onChange={onChangeEmail} /><br />
    //     Password: <input type="password" value={password} onChange={onChangePassword} /><br />
    //     <button type="button" onClick={onClickLogin}>Log In</button>
    //   </div> 
    // );
};

export default Login;