import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid } from "@mui/material";
import Typography from "@mui/joy/Typography";


const CrowdPayment = () => {
    const crowdId = useParams().crowdId;
    const [rewards, setRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const [selectedRewardId, setSelectedRewardId] = useState(null);
    const navigate = useNavigate();

    useState(() => {
        const fetchRewards = () => {
            try{
                fetch(`/crowd/${crowdId}/reward/all`)
                .then(res => {
                    console.log(res);
                    return res.json();
                }).then(data => {
                    setRewards(data);
                })
            } catch(error){
                console.error(error);
            }
        };
        fetchRewards();
    }, [])

    const onClickPaymentButton = () => {
        console.log(selectedRewardId);
        if(selectedRewardId === null){
            alert("리워드를 선택해주세요.");
            return;
        }
        navigate(`/crowd/${crowdId}/reward/${selectedRewardId}/payment`);
    }

    const onClickChooseCard = (event) => {
        event.preventDefault();
        const selected = event.currentTarget.id;
        setSelectedRewardId(selected);
        setSelectedReward(rewards.filter(reward => reward.rewardId === parseInt(selected)));
    };

    return(
        <Box sx={{'& .card-selected':{backgroundColor:'#EFEFEF'}}}>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>리워드 선택</Typography>

            {rewards.map((reward) => (
                <Card
                    className={parseInt(selectedRewardId) === reward.rewardId ? 'card-selected' : 'card-normal'}
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
                                남은 수량: {reward.rewardAmount} 개
                            </Typography>
                        </CardContent>
                    </Box>
                    <CardActions sx={{ml:'auto', mr:2}}>
                        <Typography sx={{mr:3, fontSize:16, fontWeight:700, color:'gray'}}>
                            {reward.rewardAmount} 원
                        </Typography>
                        <Button id={reward.rewardId} onClick={onClickChooseCard} variant="outlined">선택</Button>
                    </CardActions>
                </Card>
            ))}

            <Grid container sx={{mt:5}}>
                <Grid item xs={12} sx={{mb:1}}>
                    <Typography sx={{mr:3, fontSize:18, fontWeight:700}}>
                        선택된 리워드
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {selectedReward !== null &&
                    <Typography sx={{mr:3, fontSize:16, fontWeight:700, color:'gray'}}>
                        [{selectedReward[0].rewardTitle}] {selectedReward[0].rewardContent} - {selectedReward[0].rewardAmount} 원
                    </Typography>
                    }
                </Grid>
            </Grid>

            <Button fullWidth onClick={onClickPaymentButton} variant='outlined' color='success' sx={{mt: 4}}>결제하기</Button>
        </Box>
    );
};

export default CrowdPayment;