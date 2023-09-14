import { Button } from "@mui/material";

export const AdminMenu = ({setType, setIsFetchUp}) => {
    const onClickUserManageButton = () => {
        setIsFetchUp(false);
        setType("user");
        localStorage.setItem("type", "user")
    };
    const onClickAndManageButton = () => {
        setIsFetchUp(false);
        setType("and");
        localStorage.setItem("type", "and")
    };
    const onClickCrowdManageButton = () => {
        setIsFetchUp(false);
        setType("crowd");
        localStorage.setItem("type", "crowd")
    };
    const onClickReportManageButton = () => {
        setIsFetchUp(false);
        setType("report");
        localStorage.setItem("type", "report")
    };
    const onClickInfoManageButton = () => {
        setIsFetchUp(false);
        setType("infoboard");
        localStorage.setItem("type", "infoboard")
    };

    return (
        <>
            <Button fullWidth variant="outlined" color="warning" sx={{marginBottom:1}} onClick={onClickUserManageButton} >회원 관리</Button>
            <Button fullWidth variant="outlined" color="warning" sx={{marginBottom:1}} onClick={onClickAndManageButton}>모임 관리</Button>
            <Button fullWidth variant="outlined" color="warning" sx={{marginBottom:1}} onClick={onClickCrowdManageButton}>펀딩 관리</Button>
            <Button fullWidth variant="outlined" color="warning" sx={{marginBottom:1}} onClick={onClickReportManageButton}>신고 관리</Button>
            <Button fullWidth variant="outlined" color="warning" sx={{marginBottom:1}} onClick={onClickInfoManageButton}>공지 관리</Button>
        </>
    );
}