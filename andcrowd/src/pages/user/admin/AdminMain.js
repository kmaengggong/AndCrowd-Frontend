// 관리자 메인 페이지

import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import Typography from '@mui/joy/Typography';
import { AdminMenu } from "../../../components/user/admin/AdminMenu";
import { AdminContents } from "../../../components/user/admin/AdminContents";

const AdminMain = () => {
    const [type, setType] = useState(null);
    const [isFetchUp, setIsFetchUp] = useState(false);

    useState(() => {
        setType(localStorage.getItem("type"));
    }, []);

    useEffect(() => {
    }, [isFetchUp]);

    return(
        <Box sx={{marginX:7}}>

        <Typography sx={{fontSize:30, mt:5, mb: 5, textAlign:'center', fontWeight:700, color:'gray'}}><Typography sx={{color:'#00D337'}}>관리자</Typography> 페이지</Typography>
        <Typography sx={{fontSize:22, mb:2, textAlign:'center', fontWeight:700}}>
        {
            type === 'user' ? '유저' : 
            type === 'and' ? '모임' :
            type === 'crowd' ? '펀딩' :
            type === 'report' ? '신고' :
            type === 'infoboard' ? '공지' :
            ''
        }
        &nbsp;관리
        </Typography>

        <Grid container spacing={2} sx={{mb:20}}>
            <Grid item md={2} xs={12} textAlign={'center'}>
                <AdminMenu setType={setType} setIsFetchUp={setIsFetchUp}/>
            </Grid>

            <Grid item md={10} xs={12}>
                {type === null && !isFetchUp ? <></> : 
                    <AdminContents type={type} isFetchUp={isFetchUp} setIsFetchUp={setIsFetchUp} />
                }
            </Grid>
        </Grid>

        </Box>
    );
}

export default AdminMain;