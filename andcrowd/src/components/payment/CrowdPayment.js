import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, CardMedia } from "@mui/material";
import Typography from "@mui/joy/Typography";


const CrowdPayment = () => {
    const crowdId = useParams().crowdId;
    const [rewards, setRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
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
        console.log(selectedReward);
        navigate(`/crowd/${crowdId}/reward/${selectedReward}/payment`);
    }

    const onClickChooseCard = (event) => {
        event.preventDefault();
        setSelectedReward(event.target.id);
        console.log(event.target.id);
    };

    return(
        <>
            {rewards.map((reward) => (
                <Card
                    sx={{ display: 'flex' }}
                    key={reward.rewardId}
                >
                     <CardMedia
                        component="img"
                        sx={{ width: 151 }}
                        image="https://picsum.photos/id/2/600/400"
                        alt="Live from space album cover"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {reward.rewardTitle}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {reward.rewardAmount} 원
                            </Typography>
                            <Typography>{reward.rewardContent}</Typography>
                            <Typography>남은 수량: {reward.rewardAmount} 개</Typography>
                        </CardContent>
                    </Box>
                    <CardActions>
                        <Button id={reward.rewardId} onClick={onClickChooseCard}>선택</Button>
                    </CardActions>
                </Card>
            ))}
            <Button onClick={onClickPaymentButton}>결제</Button>
        </>
    );
};

export default CrowdPayment;