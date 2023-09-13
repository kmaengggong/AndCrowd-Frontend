import { Button } from "@mui/material";

export const AdminMenu = ({setType, setIsFetchUp}) => {
    const onClickUserManageButton = () => {
        setIsFetchUp(false);
        console.log("머고씨발");
        setType("user");
    };
    const onClickAndManageButton = () => {
        setIsFetchUp(false);
        setType("and");
    };
    const onClickCrowdManageButton = () => {
        setType("crowd");
    };
    const onClickReportManageButton = () => {
        setType("report");
    };
    const onClickInfoManageButton = () => {
        setType("info");
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