// 회원가입 이메일 컴포넌트

import { Button } from "@mui/material";
import { Grid, TextField } from "@mui/material";

export const SignUpEmail = ({
        email,
        setEmail,
        setIsEmailValid,
        setAuthNumber
    }) => {

    const onEmailChange = (event) => {
        setEmail(event.currentTarget.value.trim());
        setIsEmailValid(false);
        setAuthNumber('');
    };

    const onGetAuthButtonClick = async (event) => {
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
                    fetchMailAuth();
                }
                else{
                    alert("이미 존재하는 이메일입니다.");
                }
            })
        } catch(error){
            console.error("")
        }
    };

    const fetchMailAuth = async () => {
        try{
            await fetch('/mailAuth', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": email,
                })
            }).then((res) => {
                if(res.status !== 200){
                    alert("이메일을 확인해 주세요.");
                    return null;
                }
                return res.json();
            }).then((data) => {
                if(data === null) return;
                setIsEmailValid(true);
                setAuthNumber(data);
                alert("이메일 인증번호가 전송되었습니다.");
            });
        } catch(error){
            console.error(error);
        }
    }

    return (
        <>
            <Grid item xs={12} sm={9}>
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="이메일 주소"
                    name="email"
                    autoComplete="email"
                    onChange={onEmailChange}
                    // disabled={isEmailValid ? true : false}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <Button
                    className="get-auth-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={onGetAuthButtonClick}
                    // disabled={isEmailValid ? true : false}
                >
                    인증번호
                </Button>
            </Grid>
        </>
    );
};