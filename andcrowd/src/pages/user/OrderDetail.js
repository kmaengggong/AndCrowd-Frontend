import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetUserId } from "../../components/user/GetUserId";
import { Typography } from "@mui/joy";
import { Avatar, Button, Grid, IconButton } from "@mui/material";
import { GetUserInfo } from "../../components/user/GetUserInfo";
import OrderDetailContent from "../../components/user/OrderDetailContent";

const OrderDetail = () => {
    const params = useParams();
    const userId = params.userId;
    const [isUser, setIsUser] = useState(false);
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

    return (
        <>
        {isUser ?
            <>
                <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>결제 내역</Typography>

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
                        <hr />
                        </Grid>

                        <Button fullWidth variant="solid" onClick={onClickMyPageButton}>마이 페이지</Button>

                        </Grid>
                    </Grid>

                    <Grid item xs={10}>
                        <OrderDetailContent userId={userId} />
                    </Grid>
                </Grid>
            </>
        :
            <></>
        }
        </>
    );
};

export default OrderDetail;