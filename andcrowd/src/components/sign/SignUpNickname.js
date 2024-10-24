// 회원가입 닉네임 컴포넌트

import { Button, Grid, TextField } from "@mui/material"

export const SignUpNickname = ({
        nickname,
        setNickname,
        setIsNicknameValid
    }) => {

    const onNicknameChange = (event) => {
        setNickname(event.currentTarget.value.trim());
        setIsNicknameValid(false);
    };

    const onNicknameCheckClick = async (event) => {
        event.preventDefault();
        try{
            await fetch("/nicknameCheck", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userNickname": nickname,
                })
            }).then((res) => {
                if(res.status !== 200){
                    alert("이미 사용 중인 닉네임입니다.");
                }
                else{
                    setIsNicknameValid(true);
                    alert("사용 가능한 닉네임입니다.");
                }
            });
        } catch(error){
            console.error(error);
        }
    };

    return (
        <>
            <Grid item xs={12} sm={9}>
                <TextField
                    required
                    fullWidth
                    name="nickname"
                    label="닉네임"
                    type="nickname"
                    id="nickname"
                    onChange={onNicknameChange}
                />
                </Grid>
            <Grid item xs={12} sm={3}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={onNicknameCheckClick}
                >
                    중복확인
                </Button>
            </Grid>  
        </>
    );
};