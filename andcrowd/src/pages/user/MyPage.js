// import {useEffect, useState} from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Container from '@mui/material/Container';
// import Stack from '@mui/material/Stack';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import UserAndSimple from '../../../components/user/UserAndSimple';
// import { useParams } from 'react-router';

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsLoginState } from "../../context/isLoginContext";
import { GetUserId } from "../../components/user/GetUserId";
import profileImg from "../and/cat.jpg";

// const defaultTheme = createTheme();

// const MyPage = () => {
//     const params = useParams();
//     const userId = params.userId;
//     const [isUserExist, setIsUserExist] = useState(false);
//     const andCards = [1, 2, 3];
//     const crowdCards = [1, 2, 3];
//     const likeCards = [1, 2, 3];

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try{
//             const res = await fetch(`/${userId}`);
//             if(res.ok){
//                setIsUserExist(true); 
//             }
//         } catch(error){
//             console.error("Error: User Fetching");
//         }
//     }

//     // return (
//     //     {if(isUserExist){
//     //         <Link to="/NotFound"></Link>
//     //     }
//     //     <ThemeProvider theme={defaultTheme}>
//     //       <Grid container component="main">
//     //         <CssBaseline />
//     //         <Grid item xs={12} sm={2} sx={{ml:6}}>
//     //         <Box
//     //             sx={{
//     //                 my: 8,
//     //                 display: 'flex',
//     //                 flexDirection: 'column',
//     //                 alignItems: 'center',
//     //             }}
//     //         >
//     //             <Avatar
//     //                 alt="Tlqkf dho dksskdhk"
//     //                 sx={{width:50, height:50}}
//     //             />
//     //             <Button
//     //                 variant='contained'
//     //                 href="/"
//     //                 sx={{ mt:2 }}
//     //             >
//     //                 프로필 페이지 수정
//     //             </Button>
//     //             <Button
//     //                 variant='contained'
//     //                 href="/"
//     //                 sx={{ mt:2 }}
//     //             >
//     //                 메이커 페이지
//     //             </Button>
//     //             </Box>
//     //         </Grid>

//     //         <Grid item xs={12} sm={9} sx={{mx:0, alignItems: 'center'}}>
//     //             <main>
//     //                 {/* Hero unit */}
//     //                 <Box
//     //                 sx={{
//     //                     bgcolor: 'background.paper',
//     //                     alignItems: 'center',
//     //                     pb: 6,
//     //                 }}
//     //                 >
//     //                 </Box>
//     //                 <Container maxWidth="md">
//     //                 <Box
//     //                     sx={{
//     //                         display: 'flex',
//     //                         alignItems: 'center'
//     //                     }}
//     //                 >
//     //                     <Grid item sm={10}>
//     //                         <h2>모임</h2>
//     //                     </Grid>
//     //                     <Grid item sm={2}>
//     //                         <Button href="#">자세히</Button>
//     //                     </Grid>
//     //                 </Box>
//     //                 <UserAndSimple userId={userId} />

//     //                 <Box
//     //                     sx={{
//     //                         mt: 5,
//     //                         display: 'flex',
//     //                         alignItems: 'center'    
//     //                     }}
//     //                 >
//     //                     <Grid item sm={10}>
//     //                         <Typography variant='h5'>펀딩</Typography>
//     //                     </Grid>
//     //                     <Grid item sm={2}>
//     //                         <Button href="#">자세히</Button>
//     //                     </Grid>
//     //                 </Box>

//     //                 <Box
//     //                     sx={{
//     //                         mt: 5,
//     //                         display: 'flex',
//     //                         alignItems: 'center'    
//     //                     }}
//     //                 >
//     //                     <Grid item sm={10}>
//     //                         <Typography variant='h5'>찜</Typography>
//     //                     </Grid>
//     //                     <Grid item sm={2}>
//     //                         <Button href="#">자세히</Button>
//     //                     </Grid>
//     //                 </Box>
//     //                 <Grid container spacing={4}>
//     //                     {likeCards.map((card) => (
//     //                     <Grid item key={card} xs={12} sm={6} md={4}>
//     //                         <Card
//     //                         sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
//     //                         >
//     //                         <CardMedia
//     //                             component="div"
//     //                             sx={{
//     //                             // 16:9
//     //                             pt: '56.25%',
//     //                             }}
//     //                             image="https://source.unsplash.com/random?wallpapers"
//     //                         />
//     //                         <CardContent sx={{ flexGrow: 1 }}>
//     //                             <Typography gutterBottom variant="h5" component="h2">
//     //                             Heading
//     //                             </Typography>
//     //                             <Typography>
//     //                             This is a media card. You can use this section to describe the
//     //                             content.
//     //                             </Typography>
//     //                         </CardContent>
//     //                         <CardActions>
//     //                             <Button size="small">View</Button>
//     //                             <Button size="small">Edit</Button>
//     //                         </CardActions>
//     //                         </Card>
//     //                     </Grid>
//     //                     ))}
//     //                 </Grid>
//     //                 </Container>
//     //             </main>
//     //         </Grid>
//     //       </Grid>
//     //     </ThemeProvider>
//     //   );
// }

// export default MyPage;

const MyPage = () => {
    const params = useParams();
    const userId = params.userId;
    const isLogin = useIsLoginState();
    const [isOwner, setIsOwner] = useState(false);
    const [userAnd, setUserAnd] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userLike, setUserLike] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchIsUserExist();
        if(isLogin){
            if(parseInt(GetUserId()) === parseInt(userId)) setIsOwner(true);
        }
        fetchGetDynamicUserAnd();
        fetchGetDynamicUserOrder();
        fetchGetDynamicUserLike();
    }, []);

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
                console.log(data);
                setUserAnd(data);
            })
        } catch(error){
            console.error(`/user/${userId}/and: ${error}`);
        }
    }

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
    }

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
    }

    return (
        <>
            <br />
            <img src={profileImg} alt="프로필" style={{width: 100, height:100, borderRadius: 100/2 }} />
            <br />
            {isOwner ?
                <>
                    <button>프로필 페이지 수정</button>
                    <button>메이커 페이지</button>
                </>
                :
                <></>
            }
            <hr />
            <h1>참여한 모임</h1>
            <button>자세히</button>
            {userAnd.length === 0 ?
                <h2>비어있습니다.</h2>
                :
                <>
                    {userAnd.map((card) => (
                        <>
                            <h2>타이틀:{card.andTitle}</h2>
                            <h2>컨텐츠:{card.andContent}</h2>
                        </>
                    ))}
                </>
            }
            <hr />
            <h1>후원한 펀딩</h1>
            <button>자세히</button>
            {userOrder.length === 0 ?
                <h2>비어있습니다.</h2>
                :
                <>
                    {userOrder.map((card) => (
                        <>
                            <h2>{card.orderTitle}</h2>
                            <h2>{card.orderContent}</h2>
                        </>
                    ))}
                </>
                
            }
            <hr />
            <h1>찜한 목록</h1>
            <button>자세히</button>
            {userLike.length === 0 ?
                <h2>비어있습니다.</h2>
                :
                <>
                    {userLike.map((card) => (
                        <>
                            <h2>{card.projectTitle}</h2>
                            <h2>{card.projectContent}</h2>
                        </>
                    ))}
                </>
            }
        </>
    );
}

export default MyPage;