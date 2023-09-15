import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

export const AdminJudgeButton = ({type, rowSelectionModel}) => {
    const [openJudgeDialog, setOpenJudgeDialog] = useState(false);

    const handleOpenJudgeDialog = () => {
        if(rowSelectionModel.length !== 1){
            alert(`한 개의 ${type} 을(를) 선택해주세요.`);
            return;
        }
        setOpenJudgeDialog(true);
    }
    const handleCloseJudgeDialog = () => setOpenJudgeDialog(false);

    const onClickJudgeYesButton = () => {
        handleCloseJudgeDialog();
        handleJudge(1);
    }
    const onClickJudgeNoButton = () => {
        handleCloseJudgeDialog();
        handleJudge(2);
    }

    const handleJudge = (status) => {
        let url = `/${type}/${rowSelectionModel[0]}/update/status`;
        let method = "PATCH";
        
        try{
            fetch(url, {
                method: method,
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({'status': status})
            }).then(res => {
                console.log(res);
                if(res.ok) alert("심사 성공");
                else alert("심사 도중 에러가 발생했습니다.");
            })
        } catch(error){
            console.error(error);
        }
        window.location.reload(type);
    };

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                sx={{ mt:2, float:'left' }}
                onClick={handleOpenJudgeDialog}
            >
                선택 심사
            </Button>
            <Dialog
                open={openJudgeDialog}
                onClose={handleCloseJudgeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {type} 심사
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        심사 유형을 선택해주세요
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickJudgeYesButton} color="error">심사 완료</Button>
                    <Button onClick={onClickJudgeNoButton} color="error">반려</Button>
                    <Button onClick={handleCloseJudgeDialog} color="error">아니오</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}