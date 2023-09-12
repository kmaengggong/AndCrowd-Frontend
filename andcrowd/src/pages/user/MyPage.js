import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsLoginState } from "../../context/isLoginContext";
import { GetUserId } from "../../components/user/GetUserId";
import profileImg from "../and/cat.jpg";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField} from "@mui/material";
import Logout from "../../components/sign/Logout";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import MyPageCard from "../../components/user/MyPageCard";
import MyPageEmtpyCard from "../../components/user/MyPageEmptyCard";


const MyPage = () => {
    const params = useParams();
    const userId = params.userId;
    const [userInfo, setUserInfo] = useState([]);
    const [userNickname, setUserNickname] = useState(null);
    const isLogin = useIsLoginState();
    const [isOwner, setIsOwner] = useState(false);
    const [userAnd, setUserAnd] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userLike, setUserLike] = useState([]);

    const navigate = useNavigate();
    
    useEffect(() => {
        if(userId !== null){
            GetUserInfo(userId, setUserInfo);
        }
    }, [userId]);

    useEffect(() => {
            setUserNickname(userInfo.userNickname);
    }, [userInfo]);

    useEffect(() => {
        fetchIsUserExist();
        if(isLogin){
            if(parseInt(GetUserId()) === parseInt(userId)) setIsOwner(true);
        }
        fetchGetDynamicUserAnd();
        fetchGetDynamicUserOrder();
        fetchGetDynamicUserLike();
    }, []);

    const onClickProfileImgEditButton = () => {
        navigate(`/user/profileImgEdit`);
    }

    const onClickUserInfoEditButtonButton = () => {
        navigate(`/user/update`);
    };

    const onClickPasswordChangeButton = () => {
        navigate("/user/passwordChange");
    }

    const fetchIsUserExist = async () => {
        try{
            await fetch(`/user/${userId}`)
            .then(res => {
                if(res.status !== 200){
                    navigate("/NotFound");
                }
            });
        } catch(error){
            console.error(`/${userId}: ${error}`);
        }
    };

    const fetchGetDynamicUserAnd = async () => {
        try{
            await fetch(`/user/${userId}/and`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserAnd(data);
            })
        } catch(error){
            console.error(`/user/${userId}/and: ${error}`);
        }
    };

    const fetchGetDynamicUserOrder = async () => {
        try{
            await fetch(`/user/${userId}/order`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserOrder(data);
            })
        } catch(error){
            console.error(`/user/${userId}/order: ${error}`);
        }
    };

    const fetchGetDynamicUserLike = async () => {
        try{
            await fetch(`/user/${userId}/like`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserLike(data);
            })
        } catch(error){
            console.error(`/user/${userId}/like: ${error}`);
        }
    };

    return (
        <>
            <Grid container spacing={5} marginTop={8}>
                
            <Grid item xs={3} textAlign={'center'}>
                <Grid container direction="row">

                <Grid item xs={12} marginLeft={0.3}>
                    <IconButton>
                    <Avatar src={userInfo.userProfileImg} sx={{width: 100, height: 100 }} />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                <h3>{userNickname}</h3>
                <hr />
                </Grid>
                {isOwner ?
                    <>
                        <Button fullWidth variant="solid">메이커 페이지</Button>
                        <Button fullWidth variant="solid"onClick={onClickProfileImgEditButton}>프로필 사진 수정</Button>
                        <Button fullWidth variant="solid"onClick={onClickUserInfoEditButtonButton}>회원 정보 수정</Button>
                        <Button fullWidth variant="solid"onClick={onClickPasswordChangeButton}>비밀번호 변경</Button>
                    </>
                    :
                    <></>
                }
                
                </Grid>
            </Grid>

            <Grid item xs={9}>
            <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                    <h2>참여한 모임</h2>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined">자세히</Button>
                </Grid>
            </Grid>
            {userAnd.length === 0 ?
                <Grid container spacing={1} marginBottom={5}>
                    <MyPageEmtpyCard type={"and"}/>
                </Grid>
                :
                <Grid container spacing={1} marginBottom={5}>
                    {userAnd.map((project) => (
                        <MyPageCard project={project} type={"and"} />
                    ))}
                </Grid>
            }
            <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                    <h2>후원한 펀딩</h2>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined">자세히</Button>
                </Grid>
            </Grid>
            {userOrder.length === 0 ?
                <Grid container spacing={1} marginBottom={5}>
                    <MyPageEmtpyCard type={"crowd"}/>
                </Grid>
                :
                <Grid container spacing={1} marginBottom={5}>
                    {userAnd.map((project) => (
                        <MyPageCard project={project} type={"crowd"} />
                    ))}
                </Grid>
            }
            <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                    <h2>찜한 목록</h2>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined">자세히</Button>
                </Grid>
            </Grid>
            {userLike.length === 0 ?
                <Grid container spacing={1} marginBottom={5}>
                    <MyPageEmtpyCard type={"like"}/>
                </Grid>
                :
                <Grid container spacing={1} marginBottom={5}>
                    {userLike.map((project) => (
                        <MyPageCard project={project} type={"like"} />
                    ))}
                </Grid>
            }
            </Grid>

            </Grid>
        </>
    );
}

export default MyPage;