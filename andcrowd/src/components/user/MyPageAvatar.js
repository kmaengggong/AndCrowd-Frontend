import { Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyPageAvatar = ({user}) => {
    const navigate = useNavigate();

    const onClickProfileButton = () => {
        navigate(`/user/${user.userId}`);
        window.location.reload(); 
    };

    return (
        <IconButton onClick={onClickProfileButton}>
            <Avatar src={user.userProfileImg} loading="lazy" sx={{width:100, height:100}}>{user.userNickname}</Avatar>
        </IconButton>
    )
}

export default MyPageAvatar;