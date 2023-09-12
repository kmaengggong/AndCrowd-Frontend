import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { GetUserId } from "../../components/user/GetUserId";
import { useNavigate } from "react-router-dom";

const ProfileImgEdit = () => {
    const [userId, setUserId] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUserId(GetUserId());
    }, []);

    const onProfileImgChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("file", file);
        formData.append("fileType", "profileImg");
        setProfileImg(formData);
    }

    const onClickUploadProfileImgButton = async () => {
        console.log(profileImg);
        try{
            await fetch("/user/uploadProfileImg", {
                method: "POST",
                body: profileImg,
                headers:{
                    ACL: "public-read",
                },
            }).then(res => {
                if(res.ok){
                    alert("프로필 이미지를 변경했습니다.");
                    navigate(-1);
                }
                else{
                    alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
                    console.error(res);
                }
            })
        } catch(error){
            console.error(error);
        }
    }


    return (
        <Box
            sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Grid container spacing={2} maxWidth='sm'>
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
            </Grid>
        </Box>
    );
}

export default ProfileImgEdit;