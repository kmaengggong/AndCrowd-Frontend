import { Avatar, IconButton } from "@mui/material";
const MyPageEmptyAvatar = ({user}) => {

    const onClickProfileButton = () => {
        alert("다른 사람을 팔로우 해보세요!");
    };

    return (
        <IconButton onClick={onClickProfileButton}>
            <Avatar loading="lazy" sx={{width:100, height:100, marginRight:1}}>?</Avatar>
        </IconButton>
    )
}

export default MyPageEmptyAvatar;