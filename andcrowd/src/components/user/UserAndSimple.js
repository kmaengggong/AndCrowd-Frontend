import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router';

const UserAndSimple = (userId) => {
    const [andList, setAndList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const res = await fetch(`/user/${userId.userId}/and`);
            if(res.ok){
                const data = await res.json();
                setAndList(data);
            }
            else{
                throw new Error(`Error: UserAndList ${res.status}`);
            }
        } catch(error){
            console.error("Error: UserAndList Fetching");
        }
    };

    return (
        <Grid container spacing={4}>
            {!andList ? setAndList({
                andHeaderImg: "/",
                andTitle: "",
                andContent: ""
            }) : 
                andList.map((card) => (
                    <Grid item key={card} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                height: '100%',
                                // display: 'flex',
                                filexDirection: 'column'
                            }}    
                        >
                            <CardMedia
                                component="div"
                                sx={{
                                    // 16:9
                                    pt: '56.25%'
                                }}
                                image="https://source.unsplash.com/random?wallpapers"
                                title="fuck"
                            />
                            <CardContent sx={{flexGlow: 1}}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {card.andTitle}
                                </Typography>
                                <Typography>
                                    {card.andContent}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">보기</Button>
                                <Button size="small">수정</Button>
                            </CardActions>
                        </Card>
                    </Grid>
            ))}
        </Grid>
    )
}

export default UserAndSimple;