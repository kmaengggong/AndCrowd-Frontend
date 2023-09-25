import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField} from "@mui/material";
import Typography from '@mui/joy/Typography';
import MyPageEmtpyCard from "../../components/user/MyPageEmptyCard";
import MyPageCard from "../../components/user/MyPageCard";
import Loading from "../../components/etc/Loading";
import MyPageAvatar from "../../components/user/MyPageAvatar";

const MyPageAvatarDetailPage = () => {
    const params = useParams();
    const userId = params.userId;
    const [userFollow, setUserFollow] = useState(null);

    useEffect(() => {
        fetchFollow();
    }, [])

    const fetchFollow = async () => {
        try{
            await fetch(`/user/${userId}/follow`)
            .then(res => {
                return res.json();
            }).then(data => {
                console.log("userId: " + userId);
                console.log(data);
                setUserFollow(data);
            })
        } catch(error){
            console.error(`/user/${userId}/follow: ${error}`);
        }
    };

    return(
        <>
        {userFollow === null ? <Loading /> :
        <>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:2, textAlign:'center', fontWeight:700, color:'gray'}}>팔로우 목록</Typography>

            <Grid container spacing={3} marginTop={7}>
                {userFollow === null ?
                <></>
                :
                <Grid container spacing={1} marginBottom={5}>
                    {userFollow.map((follow) => (
                        <Grid item md={2} sm={12} xs={12} id={follow.userId}>
                            <MyPageAvatar user={follow} />
                        </Grid>
                    ))}
                </Grid>
                }
            </Grid>
        </>
        }
        </>
    );
};

export default MyPageAvatarDetailPage;