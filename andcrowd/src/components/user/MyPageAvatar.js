// 마이페이지 팔로우

import { Typography } from "@mui/joy";
import { Avatar, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyPageAvatar = ({user}) => {
    const navigate = useNavigate();

    const onClickProfileButton = () => {
        navigate(`/user/${user.userId}`);
        window.location.reload(); 
    };

    return (
        <Box sx={{textAlign:'center'}}>
            <IconButton onClick={onClickProfileButton}>
                <Avatar src={user.userProfileImg} loading="lazy" sx={{width:100, height:100}}>{user.userNickname}</Avatar>
            </IconButton>
            <Typography>{user.userNickname}</Typography>
        </Box>
    )
}

export default MyPageAvatar;