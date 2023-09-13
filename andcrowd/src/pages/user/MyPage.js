import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsLoginState } from "../../context/isLoginContext";
import { GetUserId } from "../../components/user/GetUserId";
import { Avatar, Button, Grid, IconButton} from "@mui/material";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import Typography from '@mui/joy/Typography';
import MyPageCard from "../../components/user/MyPageCard";
import MyPageEmtpyCard from "../../components/user/MyPageEmptyCard";
import { GetIsUserAdmin } from "../../components/user/GetIsUserAdmin";

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
    const [isAdmin, setIsAdmin] = useState(false);

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
        if(isAdmin) navigate("/iamtheadmin");
    }, [isAdmin])

    useEffect(() => {
        fetchIsUserExist();
        if(isLogin){
            if(parseInt(GetUserId()) === parseInt(userId)) setIsOwner(true);
        }
        GetIsUserAdmin(setIsAdmin);
        fetchGetDynamicUserAnd();
        fetchGetDynamicUserOrder();
        fetchGetDynamicUserLike();
    }, []);

    useEffect(() => {
        if(userAnd.length > 3) setUserAnd(userAnd.slice(0, 3));
        if(userOrder.length > 3) setUserOrder(userOrder.slice(0, 3));
        if(userLike.length > 3) setUserLike(userLike.slice(0, 3));
    }, [userAnd, userOrder, userLike]);

    const onClickProfileImgEditButton = () => {
        navigate(`/user/profileImgEdit`);
    }

    const onClickUserInfoEditButtonButton = () => {
        navigate(`/user/update`);
    };

    const onClickPasswordChangeButton = () => {
        navigate("/user/passwordChange");
    }

    const onClickMakerPageButton = () => {
        navigate("/user/maker");
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
            {isOwner ?
                <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>좋은 하루입니다, <Typography sx={{color:'#00D337'}}>{userInfo.userNickname}</Typography> 님!</Typography>
                :
                <Typography sx={{fontSize:30, marginTop:5, marginBottom:2, textAlign:'center', fontWeight:700, color:'gray'}}><Typography sx={{color:'#00D337'}}>{userInfo.userNickname}</Typography> 님의 마이페이지입니다</Typography>
            }

            <Grid container spacing={3}>
                
            <Grid item xs={2} textAlign={'center'}>
                <Grid container direction="row">

                <Grid item xs={12} marginLeft={0.3}>
                    <IconButton href={userInfo.userProfileImg}>
                    <Avatar src={userInfo.userProfileImg} loading="lazy" sx={{width: 100, height: 100 }} />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                <Typography sx={{fontSize:20, fontWeight:700, color:'#00D337', marginTop:1}}>{userNickname}</Typography>
                <hr />
                </Grid>
                {isOwner ?
                    <>
                        <Button fullWidth variant="solid" onClick={onClickMakerPageButton}>메이커 페이지</Button>
                        <Button fullWidth variant="solid" onClick={onClickProfileImgEditButton}>프로필 사진 수정</Button>
                        <Button fullWidth variant="solid" onClick={onClickUserInfoEditButtonButton}>회원 정보 수정</Button>
                        <Button fullWidth variant="solid" onClick={onClickPasswordChangeButton}>비밀번호 변경</Button>
                    </>
                    :
                    <></>
                }
                
                </Grid>
            </Grid>

            <Grid item xs={10}>
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
                        <h2>참여한 모임</h2>
                    </Grid>
                    {userAnd.length === 0 ? <></> :
                    <Grid item xs={2}>
                        <Button variant="outlined" href={`/user/${userId}/and`} sx={{float:'right'}}>자세히</Button>
                    </Grid>
                    }
                </Grid>
                <Grid container spacing={1} marginBottom={5}>
                    {userAnd.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                            <MyPageEmtpyCard type={"and"}/>
                        </Grid>
                        :
                        <>
                            {userAnd.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <MyPageCard project={project} type={"and"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>
                
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
                        <h2>후원한 펀딩</h2>
                    </Grid>
                    {userOrder.length === 0 ? <></> :
                    <Grid item xs={2}>
                        <Button variant="outlined" sx={{float:'right'}}>자세히</Button>
                    </Grid>
                    }
                </Grid>
                <Grid container spacing={1} marginBottom={5}>
                    {userOrder.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                            <MyPageEmtpyCard type={"order"}/>
                        </Grid>
                        :
                        <>
                            {userOrder.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <MyPageCard project={project} type={"order"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>

                <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
                        <h2>찜한 목록</h2>
                    </Grid>
                    {userLike.length === 0 ? <></> :
                    <Grid item xs={2}>
                        <Button variant="outlined" sx={{float:'right'}}>자세히</Button>
                    </Grid>
                    }
                </Grid>
                <Grid container spacing={1} marginBottom={5}>
                    {userLike.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                            <MyPageEmtpyCard type={"like"}/>
                        </Grid>
                        :
                        <>
                            {userLike.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <MyPageCard project={project} type={"like"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>
            </Grid>

            </Grid>
        </>
    );
}

export default MyPage;