import {React, useEffect, useState} from 'react';
import { Box, Button, Container, Grid, TextField } from '@mui/material';
import { SignUpEmail } from '../../../components/sign/SingUpEmail';
import { SignUpNickname } from '../../../components/sign/SignUpNickname';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
    const [email, setEmail] = useState(null);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const navigate = useNavigate();

    const onEmailChange = (event) => {
        setEmail(event.currentTarget.value.trim());
        setIsEmailValid(false);
    };
    const onPasswordChange = (event) => {
        setPassword(event.currentTarget.value);
        if(password.length > 0) setIsPasswordValid(true);
        else setIsPasswordValid(false);
    };

    const onEmailCheckButtonClick = async (event) => {
        event.preventDefault();
        try{
            fetch("/isEmailExists", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": email
                })
            }).then(res => {
                if(!res.ok){
                    alert("사용 가능한 이메일입니다.");
                    setIsEmailValid(true);
                }
                else{
                    alert("이미 존재하는 이메일입니다.");
                    setIsEmailValid(false);
                }
            })
        } catch(error){
            console.error("")
        }
    }
    const onFormSubmit = async (event) => {
        event.preventDefault();
        if(!isEmailValid){
            alert("이메일을 확인해 주세요.");
            return;
        }
        if(!isNicknameValid){
            alert("닉네임을 확인해 주세요.");
            return;
        }
        
        try{
            await fetch('/signup', {
                method: "POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": email,
                    "userNickname": nickname,
                    "userKorName": "관리자",
                    "userPassword": password,
                    "userTos": 1,
                    "userPrivacy": 1,
                    "userMarketing": 1,
                    "role": 1
                })
            }).then((res) => {
                if(!res.ok){
                    alert("관리자 계정 가입에 실패했습니다.");
                }
                else{
                    alert("관리자 계정 가입에 성공했습니다!");
                    navigate("/");
                }
            })
        } catch(error){
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box component={"form"} onSubmit={onFormSubmit} 
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 5,
                    mr: 5
                }}
            >
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12} sm={9}>
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
                    <Grid item xs={12} sm={3}>
                        <Button
                            className="get-auth-button"
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, mb: 1 }}
                            onClick={onEmailCheckButtonClick}
                        >
                            중복확인
                        </Button>
                    </Grid>
                    <SignUpNickname
                        nickname={nickname}
                        setNickname={setNickname}
                        setIsNicknameValid={setIsNicknameValid}
                    />
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onChange={onPasswordChange}
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
            </Box>
        </Container>
    );
}

export default AdminSignup;