import { Typography } from "@mui/joy";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/etc/Loading";
import MyPageCard from "../../components/user/MyPageCard";

const CrowdOrderDetail = () => {
    const params = useParams();
    const merchantUid = params.merchantUid;
    const [orderDetail, setOrderDetail] = useState(null);
    const [reward, setReward] = useState(null);
    const [crowd, setCrowd] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetail = () => {
            try{
                fetch(`/crowd_order/order/${merchantUid}`, {
                    method:"GET"
                }).then(res => {
                    console.log(res);
                    if(res.ok){
                        return res.json();
                    }
                    else{
                        alert("결제 정보가 없습니다.");
                        navigate("/crowd/list");
                    }
                }).then(data => {
                    setOrderDetail(data);
                })
            } catch(error){
                console.error(error);
            }
        };

        fetchOrderDetail();
    }, []);

    useEffect(() => {
        if(orderDetail !== null){
            fetchReward();
            fetchCrowd();
        }
    }, [orderDetail]);

    const fetchReward = () => {
        try{
            fetch(`/crowd/${orderDetail.crowdId}`, {
                method:"GET"
            }).then(res => {
                console.log(res);
                if(res.ok){
                    return res.json();
                }
                else{
                    alert("결제 정보가 없습니다.");
                    navigate("/crowd/list");
                }
            }).then(data => {
                console.log(data);
                setCrowd(data);
            })
        } catch(error){
            console.error(error);
        }
    };

    const fetchCrowd = () => {
        try{
            fetch(`/crowd/${orderDetail.crowdId}/reward/${orderDetail.rewardId}`, {
                method:"GET"
            }).then(res => {
                console.log(res);
                if(res.ok){
                    return res.json();
                }
                else{
                    alert("결제 정보가 없거나 잘못되었습니다.");
                    navigate("/crowd/list");
                }
            }).then(data => {
                console.log(data);
                setReward(data);
            })
        } catch(error){
            console.error(error);
        }
    }

    return (
        <>
        {orderDetail === null || reward === null || crowd === null ?
        <Loading />
        :
        <>
        <Typography sx={{fontSize:30, marginTop:5, marginBottom:5, textAlign:'center', fontWeight:700, color:'gray'}}>결제 정보</Typography>

        <Grid container direction="row" alignItems="center">
            <Grid item sm={3} xs={12} marginBottom={2}>
                <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                    결제 ID
                </Typography>
            </Grid>
            <Grid item sm={9} xs={12} marginBottom={2}>
                <TextField
                    fullWidth
                    value={orderDetail.merchantUid} 
                    disabled
                />
            </Grid>
            <Grid item sm={3} xs={12} marginBottom={2}>
                <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                    결제일
                </Typography>
            </Grid>
            <Grid item sm={9} xs={12} marginBottom={2}>
                <TextField
                    fullWidth
                    value={orderDetail.purchaseDate} 
                    disabled
                />
            </Grid>
            <Grid item sm={3} xs={12} marginBottom={2}>
                <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                    이름
                </Typography>
            </Grid>
            <Grid item sm={9} xs={12} marginBottom={2}>
                <TextField
                    fullWidth
                    value={orderDetail.purchaseName} 
                    disabled
                />
            </Grid>
            <Grid item sm={3} xs={12} marginBottom={2}>
                <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                    주소
                </Typography>
            </Grid>
            <Grid item sm={9} xs={12} marginBottom={2}>
                <TextField
                    fullWidth
                    value={orderDetail.purchaseAddress} 
                    disabled
                />
            </Grid>
            <Grid item sm={3} xs={12} marginBottom={2}>
                <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                    전화번호
                </Typography>
            </Grid>
            <Grid item sm={9} xs={12} marginBottom={2}>
                <TextField
                    fullWidth
                    value={orderDetail.purchasePhone} 
                    disabled
                />
            </Grid>
            <Grid item sm={3} xs={12} marginBottom={2}>
                <Typography sx={{fontSize:22, textAlign:'center', fontWeight:700, color:'gray'}}>
                    결제상태
                </Typography>
            </Grid>
            <Grid item sm={9} xs={12} marginBottom={2}>
                <TextField
                    fullWidth
                    value={orderDetail.purchaseStatus} 
                    disabled
                />
            </Grid>
            <Grid xs={12}>
                <Typography sx={{fontSize:30, marginTop:5, marginBottom:5, textAlign:'center', fontWeight:700, color:'gray'}}>후원한 펀딩</Typography>
            </Grid>
            <Grid xs={4} sx={{mx:20}}>
                <MyPageCard project={crowd} type={'order'} />
            </Grid>
            <Grid xs={12}>
                <Typography sx={{fontSize:30, marginTop:5, marginBottom:5, textAlign:'center', fontWeight:700, color:'gray'}}>결제 리워드</Typography>
            </Grid>
            <Grid xs={12} sx={{mx:20}}>
            <Card
                sx={{ display: 'flex', mb:2 }}
                key={reward.rewardId}
            >
                <CardMedia
                    component="img"
                    sx={{ width: 150 }}
                    image="https://picsum.photos/id/2/600/400"
                    alt="Live from space album cover"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography sx={{fontSize:20, fontWeight:700, color:'#00D337'}}>
                            {reward.rewardTitle}
                        </Typography>
                        <Typography sx={{fontSize:18, fontWeight:700}}>
                            {reward.rewardContent}
                        </Typography>
                        <Typography sx={{fontSize:14, fontWeight:700, color:'gray'}}>
                            남은 수량: {reward.rewardLeft} 개
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
            </Grid>
        </Grid>
        </>
        }
        </>
    );
};

export default CrowdOrderDetail;