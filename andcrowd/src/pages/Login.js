import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  비밀번호 분실
                </Link>
              </Grid>
              <Grid item xs>
                <Link href="#" variant="body2">
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