// 유저 정보 변경 페이지

import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import { useNavigate, useParams } from "react-router-dom";

const UserInfoEdit = () => {
    const params = useParams();
    const userId = params.userId;
    const [userInfo, setUserInfo] = useState([]);

    const [originNickname, setOriginNickname] = useState(null);
    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(true);

    const [phoneNumber, setPhoneNumber] = useState('');

    const [openResignDialog, setOpenResignDialog] = useState(false);
    const handleOpenResignDialog = () => setOpenResignDialog(true);
    const handleCloseResignDialog = () => setOpenResignDialog(false);

    const navigate = useNavigate();

    useEffect(() => {
        GetUserInfo(userId, setUserInfo);
    }, []);

    useEffect(() => {
        setOriginNickname(userInfo.userNickname);
        setNickname(userInfo.userNickname);
    }, [userInfo]);

    useEffect(() => {
        if(phoneNumber.length === 10){
            setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        if(phoneNumber.length === 13){
            setPhoneNumber(phoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
    }, [phoneNumber])

    const onNicknameChange = (event) => {
        event.preventDefault();
        setNickname(event.currentTarget.value.trim());
        setIsNicknameValid(false);
    };

    const onPhoneNumberKeyDown = (event) => {
        event.preventDefault();
        const regex = /^[0-9\b -]{0,13}$/;
        if(regex.test(event.target.value)){
            setPhoneNumber(event.target.value);
        }
    }

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

    const onClickSubmitButton = () => {
        if(!isNicknameValid){
            alert("닉네임을 확인해주세요.");
            return;
        }

        if(phoneNumber === '' && nickname === originNickname){
            alert("수정사항이 없습니다.");
        }

        console.log("nick " + nickname);
        console.log("origin: " + originNickname);
        console.log("phone: " + phoneNumber);

        let updateNickname = null;
        let updatePhone = null;
        if(nickname !== originNickname){
            updateNickname = nickname;
        }
        if(phoneNumber !== ''){
            updatePhone = phoneNumber;
        }

        try{
            fetch(`/user/${userId}`, {
                method: "PATCH",
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({
                    "userNickname": updateNickname,
                    "userPhone": updatePhone
                })
            }).then(res => {
                if(res.ok){
                    alert("정보 수정이 완료되었습니다.");
                    navigate(-1);
                }
                else{
                    alert("다시 시도해주세요.");
                }
            })
        } catch(error){
            console.error("onClickSubmitButton: ;" + error)
        }
    }

    const onClickCancleButton = () => {
        navigate(-1);
    }

    const onClickResignYesButton = () => {
        try{
            fetch(`/user/${userId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                }
            }).then(res => {
                handleCloseResignDialog();
                if(res.ok){
                    navigate("/logout");
                    alert("회원 탈퇴가 완료되었습니다.");
                }
            })
        } catch(error){
            console.error("onClickResignYesButton: " + error);
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
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>개인 정보 수정 </Typography>
            <Grid container spacing={2} maxWidth={'sm'}>
                <Grid item xs={12} sm={9}>
                    <TextField
                        fullWidth
                        name="nickname"
                        label="닉네임"
                        type="nickname"
                        id="nickname"
                        value={nickname}
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
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name=""
                        label="전화번호"
                        value={phoneNumber}
                        onChange={onPhoneNumberKeyDown}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={onClickSubmitButton}
                    >
                        변경
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={onClickCancleButton}
                    >
                        취소
                    </Button>
                </Grid>
                <Grid item xs={12}>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={handleOpenResignDialog}
                >
                    회원 탈퇴
                </Button>
                </Grid>
            </Grid>
            </Box>

            <Dialog
                open={openResignDialog}
                onClose={handleCloseResignDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    회원 탈퇴
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        정말로 탈퇴하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickResignYesButton}>예</Button>
                    <Button onClick={handleCloseResignDialog}>아니오</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UserInfoEdit;