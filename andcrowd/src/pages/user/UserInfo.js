import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import { Typography } from "@mui/joy";
import { Avatar, Button, Grid, IconButton, TextField } from "@mui/material";
import { GetUserId } from "../../components/user/GetUserId";

const UserInfo = () => {
    const [isUser, setIsUser] = useState(false);
    const params = useParams();
    const userId = params.userId;
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isUser = () => {
            return GetUserId();
        }
        const myId = isUser();
        // 본인이 아니면 뒤로가기
        if(parseInt(myId) !== parseInt(userId)){
            navigate("/");
        }
        else{
            setIsUser(true);
        }

        GetUserInfo(userId, setUserInfo);
    }, []);

    const onClickMyPageButton = () => {
        navigate(`/user/${userId}`);
    }
    const onClickProfileImgEditButton = () => {
        navigate(`/user/${userId}/profileImgEdit`);
    }
    const onClickUserInfoEditButtonButton = () => {
        navigate(`/user/${userId}/update`);
    };
    const onClickPasswordChangeButton = () => {
        navigate(`/user/${userId}/passwordChange`);
    };

    return (
        <>
        {isUser && <>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>회원 정보</Typography>

            <Grid container spacing={3}>
                
            <Grid item xs={2} textAlign={'center'}>
                <Grid container direction="row">

                <Grid item xs={12} marginLeft={0.3}>
                    <IconButton href={userInfo.userProfileImg}>
                    <Avatar src={userInfo.userProfileImg} loading="lazy" sx={{width: 100, height: 100 }} />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                <Typography sx={{fontSize:20, fontWeight:700, color:'#00D337', marginTop:1}}>{userInfo.userNickname}</Typography>
                <hr />
                </Grid>
                <Button fullWidth variant="solid" onClick={onClickMyPageButton}>마이 페이지</Button>
                <Button fullWidth variant="solid" onClick={onClickProfileImgEditButton}>프로필 사진 수정</Button>
                <Button fullWidth variant="solid" onClick={onClickUserInfoEditButtonButton}>회원 정보</Button>
                <Button fullWidth variant="solid" onClick={onClickPasswordChangeButton}>비밀번호 변경</Button>
                </Grid>
            </Grid>

            <Grid item xs={10}>
                {userInfo.length !== 0 &&
                <Grid container direction="row" alignItems="center">
                    <Grid item sm={3} xs={12}>
                        <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                            닉네임
                        </Typography>
                    </Grid>
                    <Grid item sm={9} xs={12}>
                        <TextField
                            fullWidth
                            value={userInfo.userNickname} 
                            disabled
                        />
                    </Grid>
                </Grid>
                }
            </Grid>

            </Grid>
        </>}
        </>
    );
};

export default UserInfo;