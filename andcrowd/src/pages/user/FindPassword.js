import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FindPassword = () => {
    const [email, setEmail] = useState(null);
    const [isEmailSend, setIsEmailSend] = useState(false);
    const [authNumber, setAuthNumber] = useState(null);
    const [originAuthNumber, setOriginAuthNumber] = useState(null);
    const [isAuthNumberValid, setIsAuthNumberValid] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const navigate = useNavigate();

    const onEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const onAuthNumberChange = (event) => {
        setAuthNumber(event.target.value);
    }
    const onNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    }

    const onClickFindPasswordButton = () => {
        console.log(email);

        try{
            fetch("/mailAuth", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": email
                })
            }).then(res => {
                if(!res.ok){
                    alert("해당 이메일로 가입한 계정이 없습니다.");
                    return null;
                }
                return res.json();
            }).then(data => {
                if(data === null) return;
                setOriginAuthNumber(data);
                setIsEmailSend(true);
                alert("이메일 인증번호가 전송되었습니다.");
            })
        } catch(error){
            console.error("")
        }
    };
    
    const onClickAuthNumberCheckButton = () =>{
        console.log("authN: " + authNumber);
        console.log("origin: " + originAuthNumber);
        if(!authNumber.match(originAuthNumber)){
            alert("인증번호가 일치하지 않습니다.");
            return;
        }
        alert("새로운 비밀번호를 입력해주세요.");
        setIsAuthNumberValid(true);
    }

    const onClickNewPasswordButton = () => {
        try{
            fetch("/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": email,
                    "userPassword": newPassword
                })
            }).then(res => {
                if(!res.ok){
                    alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
                    navigate(-1);
                }
                else{
                    alert("비밀번호가 변경되었습니다.");
                    navigate("/");
                }
            })
        } catch(error){
            console.error(error);
        }
    }


    return(
        <Box
            sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Grid container spacing={2} maxWidth='sm'>
                <Grid item xs={12} textAlign={'center'} marginBottom={5}>
                    <Typography fontSize={22} fontWeight={700}>
                        비밀번호 찾기
                    </Typography>
                </Grid>
                {
                    !isEmailSend ?
                    <>
                        <TextField
                            required
                            fullWidth
                            name="email"
                            label="가입한 이메일을 입력해주세요"
                            type="email"
                            sx={{ mb: 2}}
                            onChange={onEmailChange}
                        />
                        <Button
                            type="submit"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2}}
                            onClick={onClickFindPasswordButton}
                            >
                                비밀번호 찾기
                        </Button>
                    </>
                    :
                    <></>
                }
                {
                    !isAuthNumberValid && isEmailSend ?
                    <>
                        <TextField
                            required
                            fullWidth
                            name="auth-number"
                            label="이메일로 전송된 인증번호를 입력해주세요"
                            type="auth-number"
                            sx={{ mb: 2}}
                            onChange={onAuthNumberChange}
                        />
                        <Button
                            type="submit"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2}}
                            onClick={onClickAuthNumberCheckButton}
                            >
                                인증번호 확인
                        </Button>
                    </>
                    :
                    <></>
                }
                {
                    isAuthNumberValid ?
                    <>
                        <TextField
                            required
                            fullWidth
                            name="new-password"
                            label="새로운 비밀번호를 입력해주세요"
                            type="password"
                            sx={{ mb: 2}}
                            onChange={onNewPasswordChange}
                        />
                        <Button
                            type="submit"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2}}
                            onClick={onClickNewPasswordButton}
                            >
                                비밀번호 변경
                        </Button>
                    </>
                    :
                    <></>
                }
            </Grid>
        </Box>
    );
}

export default FindPassword;