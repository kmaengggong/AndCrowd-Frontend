// 공지사항 디테일 페이지

import Typography from "@mui/joy/Typography";
import { Avatar, Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from '../../icon.png';

const InfoboardDetail = () => {
    const infoId = useParams().infoId;
    const [info, setInfo] = useState([]);
    
    useEffect(() => {
    }, [info]);

    useState(() => {
        const fetchInfo = () => {
            try{
                fetch(`/infoboard/${infoId}`)
                .then(res => {
                    console.log(res);
                    return res.json();
                }).then(data => {
                    data.publishedAt = data.publishedAt.replace('-', '.').replace('-', '.').split('T')[0];
                    setInfo(data);
                })
            } catch(error){
                console.error(error);
            }
        };

        fetchInfo();
    })

    return (
        <Box
            sx={{
                mx:3
            }}
        >
            <Typography sx={{fontWeight:600, fontSize:20, mt:5, mb:3, mx:1}}><Typography>[{info.infoType ? '공지사항' : '새소식'}]</Typography> {info.infoTitle}</Typography>
            <Grid container>
                <Grid item sx={{ml:1, mr:2}}>
                <Avatar src={logo} sx={{width: 50, height: 50}}/>
                </Grid>
                <Grid item>
                    <Typography sx={{fontWeight:600, fontSize:17, color:'#555555'}}>
                        &Crowd
                    </Typography>
                    <Typography sx={{fontWeight:600, fontSize:15, color:'gray', mb:2}}>
                        {info.publishedAt}
                    </Typography>
                </Grid>
            </Grid>
            <hr />

            <Typography sx={{mx:1, my:3, minHeight:400}}>
                {info.infoContent}
            </Typography>
            <hr />
        </Box>
    );
};

export default InfoboardDetail;