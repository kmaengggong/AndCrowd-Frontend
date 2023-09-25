// 유저 모임/펀딩/찜/메이커 리스트 페이지

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import Typography from '@mui/joy/Typography';
import MyPageCard from "../../components/user/MyPageCard";
import Loading from "../../components/etc/Loading";

const MyPageCardsDetailPage = () => {
    const params = useParams();
    const userId = params.userId;
    const type = params.type;
    const [projects, setProjects] = useState(null);
    const [projectLen, setProjectLen] = useState(0);
    const headText = {
        and: "참여한 모임",
        order: "후원한 펀딩",
        like: "찜한 프로젝트",
        makerAnd: "생성한 모임",
        makerCrowd: "생성한 펀딩"
    };
    const typeForFetch = {
        and: 'and',
        order: 'crowd',
        like: 'like',
        makerAnd: 'maker/0',
        makerCrowd: 'maker/1'
    }

    useEffect(() => {
        fetchProject();
    }, [])

    useEffect(() => {
        if(projects !== null){
            setProjectLen(projects.length);
        }
    }, [projects])

    const fetchProject = async () => {
        try{
            await fetch(`/user/${userId}/${typeForFetch[type]}`)
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
        {projects === null ? <Loading /> :
        <>
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:2, textAlign:'center', fontWeight:700, color:'gray'}}>{headText[type]}</Typography>

            <Grid container spacing={3} marginTop={7}>
                {projectLen === 0 ?
                <></>
                :
                <Grid container spacing={1} marginBottom={5}>
                    {projects.map((project) => (
                        <Grid item md={3} sm={12} xs={12} id={project.projectId}>
                            <MyPageCard project={project} type={type} />
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

export default MyPageCardsDetailPage;