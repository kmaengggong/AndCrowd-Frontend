import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField} from "@mui/material";
import Typography from '@mui/joy/Typography';
import MyPageEmtpyCard from "../../components/user/MyPageEmptyCard";
import MyPageCard from "../../components/user/MyPageCard";

const MyPageCardsDetailPage = () => {
    const params = useParams();
    const userId = params.userId;
    const type = params.type;
    const [projects, setProjects] = useState([]);
    const [projectLen, setProjectLen] = useState(0);

    useEffect(() => {
        fetchProject();
    }, [])

    useEffect(() => {
        if(projects.length > 0){
            setProjectLen(projects.length);
        }
    }, [projects])

    const fetchProject = async () => {
        try{
            await fetch(`/user/${userId}/${type}`)
            .then(res => {
                return res.json();
            }).then(data => {
                setProjects(data);
            })
        } catch(error){
            console.error(error);
        }
    };

    return(
        <>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:2, textAlign:'center', fontWeight:700, color:'gray'}}>&</Typography>

            <Grid container spacing={3} marginTop={7}>
                {projectLen === 0 ?
                <></>
                :
                <Grid container spacing={1} marginBottom={5}>
                    {projects.map((project) => (
                        <Grid item md={3} sm={12} xs={12}>
                            <MyPageCard project={project} type={type} />
                        </Grid>
                    ))}
                </Grid>
                }
            </Grid>
        </>
    );
};

export default MyPageCardsDetailPage;