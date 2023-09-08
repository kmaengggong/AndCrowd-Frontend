import { useContext, useEffect, useState } from "react";
import { GetUserId } from "../../components/user/GetUserId";
import { Box, Button, Grid, Input, Modal, TextField, Typography } from "@mui/material";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isLoginContext } from "../../context/isLoginContext";
import Logout from "../../components/sign/Logout";

const UserInfoEdit = () => {
    const navigate = useNavigate();
    const {setIsLogin} = useContext(isLoginContext);
    const [userId, setUserId] = useState(0);
    const [userInfo, setUserInfo] = useState([]);
    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [openResignModal, setOpenResignModal] = useState(false);
    const handleOpenResignModal = () => setOpenResignModal(true);
    const handleCloseResignModal = () => setOpenResignModal(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        p: 4,
      };

    useEffect(() => {
        setUserId(GetUserId());
    }, []);

    useEffect(() => {
        console.log(1);
        if(userId !== 0){
            GetUserInfo(userId, setUserInfo);
        }
    }, [userId]);

    useEffect(() => {
        console.log(2);
        setNickname(userInfo.userNickname);
    }, [userInfo]);

    useEffect(() => {
        console.log(phoneNumber);
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

    const onProfileImgChange = (event) => {
        // const file = event.target.files[0];
        // const imageUrl = URL.createObjectURL(file);
        // setProfileImg(imageUrl);
        // setProfileImg(Array.from(event.target.files));
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        setProfileImg(formData);
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

    const uploadProfileImg = (event) => {
        event.preventDefault();
        // const formData = new FormData();
        // profileImg.map((file) => {
        //     formData.append("files", file);
        // });
        // console.log(Array.from(formData));

        try{
            // fetch('http://localhost:3000/file/uploads', {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": 'multipart/form-data'
            //     },
            //     body: formData
            // }).then((res) => {
            //     console.log(res.data);
            // })
        } catch(error){
            console.error("uploadProfileimg: " + error);
        }
    }

    const onClickPasswordChangeButton = () => {
        navigate("/user/passwordChange");
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
                if(res.ok){
                    Logout();
                    alert("회원 탈퇴가 완료되었습니다.");
                }
            })
        } catch(error){
            console.error("onClickResignYesButton: " + error);
        }
    }

    const onClickSubmitButton = () => {

    }

    const onClickCancleButton = () => {
        navigate(-1);
    }

    return (
        <>
            <Grid container spacing={2}>
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
                        id=""
                        value={phoneNumber}
                        onChange={onPhoneNumberKeyDown}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField
                        type="file"
                        fullWidth
                        name=""
                        onChange={onProfileImgChange}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={uploadProfileImg}
                    >
                        프로필 사진 올리기
                    </Button>
                </Grid>  
            </Grid>
            <img src={profileImg} alt="프로필 사진 미리보기"/>
            <Button onClick={onClickPasswordChangeButton}>비밀번호 변경</Button>
            <Button onClick={handleOpenResignModal}>회원 탈퇴</Button>
            <Button onClick={onClickSubmitButton}>변경</Button>
            <Button onClick={onClickCancleButton}>취소</Button>

            <Modal
                open={openResignModal}
                onClose={handleCloseResignModal}
                aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        회원 탈퇴
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        정말로 탈퇴하시겠습니까?
                    </Typography>
                    <Button onClick={onClickResignYesButton}>예</Button>
                    <Button onClick={handleCloseResignModal}>아니오</Button>
                </Box>
        </Modal>

        </>
    );
}

export default UserInfoEdit;