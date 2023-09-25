// 팀 소개 페이지

import { Box, Grid } from "@mui/material";
import Typography from '@mui/joy/Typography';
import Teammate from "../../components/etc/Teammate";

const Team = () => {
    return(
        <Box sx={{marginX:7}}>

        <Typography sx={{fontSize:30, marginTop:5, marginBottom:5, textAlign:'center', fontWeight:700, color:'gray'}}><Typography sx={{color:'#00D337'}}>&Crowd</Typography> 팀소개</Typography>
        <Grid container marginBottom={7}>
            <Teammate
                name={"김명호"}
                githubUrl={"https://github.com/kmaengggong"}
                profileUrl={"https://avatars.githubusercontent.com/u/48409954?v=4"}
                role={"조장"}
                parts={["User", "로그인", "회원가입", "마이페이지", "스프링 시큐리티", "JWT", "관리자"]}
                introduce={"안녕하세요. @))))))"}
            />
            <Teammate
                name={"오송이"}
                githubUrl={"https://github.com/songyoh"}
                profileUrl={"https://avatars.githubusercontent.com/u/129033321?v=4"}
                role={"조원"}
                parts={["Crowd", "펀딩 리스트"]}
                introduce={"ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄹ"}
            />
            <Teammate
                name={"임규빈"}
                githubUrl={"https://github.com/gyubee"}
                profileUrl={"https://avatars.githubusercontent.com/u/126438093?v=4"}
                role={"조원"}
                parts={["&", "채팅", "피드", "검색", "신고", "QnA", "챗봇", "관리 페이지", "페이징"]}
                introduce={"ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄹ"}
            />
            <Teammate
                name={"양현성"}
                githubUrl={"https://github.com/Void-OvO"}
                profileUrl={"https://avatars.githubusercontent.com/u/125037243?v=4"}
                role={"조원"}
                parts={["&", "디자인"]}
                introduce={"ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄹ"}
            />
        </Grid>

        </Box>
    );
}

export default Team;