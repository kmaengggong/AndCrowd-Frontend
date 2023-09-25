// 유저 프로필 사진 변경 페이지

import { Typography } from "@mui/joy";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProfileImgEdit = () => {
    const params = useParams();
    const userId = params.userId;
    const [uploadFileUrl, setUploadFileUrl] = useState("");
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    const onProfileImgChange = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("file", file);
        formData.append("fileType", "profileImg");

        try{
            await fetch("/user/uploadProfileImg", {
                method: "POST",
                body: formData,
                headers:{
                    ACL: "public-read",
                },
            }).then(res => {
                if(res.ok){
                    setIsValid(true);
                    return res.json();
                }
                else{
                    alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
                    console.error(res);
                    return false;
                }
            }).then(data => {
                setUploadFileUrl(data.uploadFileUrl);
            })
        } catch(error){
            console.error(error);
        }
    }

    const onClickUploadProfileImgButton = async () => {
        if(!isValid){
            alert("이미지 업로드에 실패했습니다.");
            navigate(-1);
        }
        else{
            alert("이미지 업로드에 성공했습니다.");
            navigate(-1);
        }
        // try{
        //     await fetch("/user/uploadProfileImg", {
        //         method: "POST",
        //         body: profileImg,
        //         headers:{
        //             ACL: "public-read",
        //         },
        //     }).then(res => {
        //         if(res.ok){
        //             alert("프로필 이미지를 변경했습니다.");
        //             navigate(-1);
        //         }
        //         else{
        //             alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        //             console.error(res);
        //         }
        //     })
        // } catch(error){
        //     console.error(error);
        // }
    }

    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>프로필 사진 수정</Typography>
            <Grid container spacing={2} maxWidth='md' alignItems={'center'}>
                <Grid item xs={12} sm={9}>
                    <TextField
                        type="file"
                        fullWidth
                        onChange={onProfileImgChange}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={onClickUploadProfileImgButton}
                    >
                        프로필 사진 올리기
                    </Button>
                </Grid>
                <Typography sx={{fontSize:22, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>미리보기</Typography>
                <Grid item xs={12}>
                    {uploadFileUrl && <img src={uploadFileUrl} alt="업로드 이미지" width={500} />}
                </Grid>
            </Grid>
        </Box>
    );
}

export default ProfileImgEdit;