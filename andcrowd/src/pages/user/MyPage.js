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
import MyPageAvatar from "../../components/user/MyPageAvatar";
import MyPageEmptyAvatar from "../../components/user/MyPageEmptyAvatar";
import Loading from "../../components/etc/Loading";

const MyPage = () => {
    const params = useParams();
    const userId = params.userId;
    const [isExists, setIsExists] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const isLogin = useIsLoginState();
    const [isOwner, setIsOwner] = useState(false);
    const [userAnd, setUserAnd] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userLike, setUserLike] = useState([]);
    const [userFollow, setUserFollow] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchIsUserExist();
        GetUserInfo(userId, setUserInfo);
        if(isLogin){
            if(parseInt(GetUserId()) === parseInt(userId)) setIsOwner(true);
            else{
                setIsFollowed(fetchIsFollowed());
                console.log(fetchIsFollowed());
            }
        }
        fetchGetDynamicUserAnd();
        fetchGetDynamicUserOrder();
        fetchGetDynamicUserLike();
        fetchGetDynamicUserFollow();
    }, []);

    useEffect(() => {
        if(userAnd.length > 3) setUserAnd(userAnd.slice(0, 3));
        if(userOrder.length > 3) setUserOrder(userOrder.slice(0, 3));
        if(userLike.length > 3) setUserLike(userLike.slice(0, 3));
        if(userFollow.length > 5) setUserFollow(userLike.slice(0, 5));
    }, [userAnd, userOrder, userLike, userFollow]);

    const onClickUserInfoButtonButton = () => {
        navigate(`/user/${userId}/info`);
    };

    const onClickMakerPageButton = () => {
        navigate(`/user/${userId}/maker`);
    };

    const onClickOrderPageButton = () => {
        navigate(`/user/${userId}/order`)
    }

    const fetchIsUserExist = async () => {
        try{
            await fetch(`/user/${userId}`)
            .then(res => {
                if(res.status !== 200){
                    navigate("/NotFound");
                }
                else{
                    setIsExists(true);
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
            await fetch(`/user/${userId}/crowd`)
            .then(res => {
                return res.json();
            }).then(data => {
                console.log(data);
                setUserOrder(data);
            })
        } catch(error){
            console.error(`/user/${userId}/crowd: ${error}`);
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

    const fetchGetDynamicUserFollow = async () => {
        try{
            await fetch(`/user/${userId}/follow`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserFollow(data);
            })
        } catch(error){
            console.error(`/user/${userId}/follow: ${error}`);
        }
    };

    const fetchIsFollowed = async () => {
        try {
            const myId = GetUserId();
            const response = await fetch(`/user/${myId}/follow/${userId}`);  
            if (response.ok) {
                setIsFollowed(true);
            } else {
                setIsFollowed(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null; // 에러 발생 시 null 반환
        }
    }

    const fetchFollow = () => {
        try {
            const myId = GetUserId();
            const response = fetch(`/user/${myId}/follow/${userId}`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            console.log(response);
            if (response.ok) {
                setIsFollowed(!isFollowed);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <>
            {isExists && userInfo !== null ?
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
                            <Avatar src={userInfo.userProfileImg} loading="lazy" sx={{width: 100, height: 100 }}>{userInfo.userNickname}</Avatar>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                        <Typography sx={{fontSize:20, fontWeight:700, color:'#00D337', marginTop:1}}>{userInfo.userNickname}</Typography>
                        <hr style={{marginTop:15, marginBottom:15}} />
                        </Grid>
                        {isOwner ?
                            <>
                                <Button fullWidth variant="solid" onClick={onClickUserInfoButtonButton}>회원 정보</Button>
                                <Button fullWidth variant="solid" onClick={onClickOrderPageButton}>결제 내역</Button>
                            </>
                            :
                            <>
                                {isFollowed ?
                                <Button fullWidth variant="outlined" color="success" onClick={fetchFollow} sx={{mb:1}}>팔로잉</Button>
                                :
                                <Button fullWidth variant="contained" color="success" onClick={fetchFollow} sx={{mb:1}}>팔로우</Button>
                                }
                            </>
                        }
                        <Button fullWidth variant="solid" onClick={onClickMakerPageButton}>메이커 페이지</Button>
                        
                        </Grid>
                    </Grid>

                    <Grid item xs={10}>
                        <Grid container direction="row" alignItems="center">
                            <Grid item xs={10}>
                                <h2>참여한 모임</h2>
                            </Grid>
                            {userAnd.length === 0 ? <></> :
                            <Grid item xs={2}>
                                <Button variant="outlined" href={`/user/${userId}/detail/and`} sx={{float:'right'}} color="success">자세히</Button>
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
                                <Button variant="outlined" sx={{float:'right'}} href={`/user/${userId}/detail/order`} color="success">자세히</Button>
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
                                <Button variant="outlined" sx={{float:'right'}} href={`/user/${userId}/detail/like`} color="success">자세히</Button>
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

                        <Grid container direction="row" alignItems="center">
                            <Grid item xs={10}>
                                <h2>팔로우 목록</h2>
                            </Grid>
                            {userLike.length === 0 ? <></> :
                            <Grid item xs={2}>
                                <Button variant="outlined" sx={{float:'right'}} href={`/user/${userId}/detail/follow`} color="success">자세히</Button>
                            </Grid>
                            }
                        </Grid>
                        <Grid container spacing={1} marginBottom={5}>
                            {userFollow.length === 0 ?
                                <Grid item md={4} sm={12} xs={12}>
                                    <MyPageEmptyAvatar />
                                </Grid>
                                :
                                <>
                                    {userFollow.map((user) => (
                                        <Grid item md={2} sm={6} xs={12}>
                                            <MyPageAvatar user={user} />
                                        </Grid>
                                    ))}
                                </>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </>
            :
            <Loading />
            }
        </>
    );
}

export default MyPage;