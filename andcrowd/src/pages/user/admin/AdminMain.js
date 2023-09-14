import { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
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

        <Typography sx={{fontSize:30, mt:5, mb:5, textAlign:'center', fontWeight:700, color:'gray'}}><Typography sx={{color:'#00D337'}}>관리자</Typography> 페이지</Typography>

        <Grid container spacing={2} sx={{mb:20}}>
            <Grid item md={2} xs={12} textAlign={'center'}>
                <AdminMenu setType={setType} setIsFetchUp={setIsFetchUp}/>
            </Grid>

            <Grid item md={10} xs={12}>
                {type === null && !isFetchUp ? <></> : 
                    <AdminContents type={type} isFetchUp={isFetchUp} setIsFetchUp={setIsFetchUp}/>
                }
            </Grid>
        </Grid>

        </Box>
    );
}

export default AdminMain;