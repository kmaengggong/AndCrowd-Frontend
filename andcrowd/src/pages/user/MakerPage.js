// 메이커 페이지

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Grid, IconButton } from "@mui/material";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import Typography from '@mui/joy/Typography';
import MyPageCard from "../../components/user/MyPageCard";
import MyPageEmtpyCard from "../../components/user/MyPageEmptyCard";
import Loading from "../../components/etc/Loading";

const MakerPage = () => {
    const params = useParams();
    const userId = params.userId;
    const [userInfo, setUserInfo] = useState([]);
    const [userMakerAnd, setUserMakerAnd] = useState(null);
    const [userMakerCrowd, setUserMakerCrowd] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        GetUserInfo(userId, setUserInfo);
        fetchGetDynamicUserMakerAnd();
        fetchGetDynamicUserMakerCrowd();
    }, []);

    const onClickMyPageButton = () => {
        navigate(`/user/${userId}`);
    }

    const fetchGetDynamicUserMakerAnd = async () => {
        try{
            await fetch(`/user/${userId}/maker/0`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserMakerAnd(data);
            })
        } catch(error){
            console.error(error);
        }
    };

    const fetchGetDynamicUserMakerCrowd = async () => {
        try{
            await fetch(`/user/${userId}/maker/1`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserMakerCrowd(data);
            })
        } catch(error){
            console.error(error);
        }
    };

    return (
        <>
            {userMakerAnd === null || userMakerCrowd === null ?
            <Loading />
            :
            <>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}><Typography sx={{color:'#00D337'}}>{userInfo.userNickname}</Typography> 님의 메이커 페이지입니다</Typography>

            <Grid container spacing={3}>
                
            <Grid item xs={2} textAlign={'center'}>
                <Grid container direction="row">
          
                <Grid item xs={12} marginLeft={0.3}>
                    <IconButton href={userInfo.userProfileImg}>
                    <Avatar src={userInfo.userProfileImg} loading="lazy" sx={{width: 100, height: 100}} />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                <Typography sx={{fontSize:20, fontWeight:700, color:'#00D337', marginTop:1}}>{userInfo.userNickname}</Typography>
                <hr style={{marginTop:15, marginBottom:15}} />
                </Grid>
                <Button fullWidth variant="solid" onClick={onClickMyPageButton}>마이 페이지</Button>

                </Grid>
            </Grid>

            <Grid item xs={10}>
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
                        <h2>모임</h2>
                    </Grid>
                    {userMakerAnd.length === 0 ? <></> : 
                    <Grid item xs={2}>
                        <Button variant="outlined" sx={{float:'right'}} href={`/user/${userId}/detail/makerAnd`} color="success">자세히</Button>
                    </Grid>
                    }
                </Grid>
                <Grid container spacing={1} marginBottom={5}>
                    {userMakerAnd.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                            <MyPageEmtpyCard type={"makerAnd"}/>
                        </Grid>
                        :
                        <>
                            {userMakerAnd.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <MyPageCard project={project} type={"makerAnd"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>

                <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
                        <h2>펀딩</h2>
                    </Grid>
                    {userMakerCrowd.length === 0 ? <></> : 
                    <Grid item xs={2}>
                        <Button variant="outlined" sx={{float:'right'}}  href={`/user/${userId}/detail/makerCrowd`} color="success">자세히</Button>
                    </Grid>
                    }
                </Grid>
                <Grid container spacing={1} marginBottom={5}>
                    {userMakerCrowd.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                            <MyPageEmtpyCard type={"makerCrowd"}/>
                        </Grid>
                        :
                        <>
                            {userMakerCrowd.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <MyPageCard project={project} type={"makerCrowd"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>
            </Grid>

            </Grid>
            </>
            }
        </>
    );
}

export default MakerPage;