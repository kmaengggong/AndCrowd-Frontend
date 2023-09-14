import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

export const AdminReportProcessButton = ({type, rowSelectionModel}) => {
    const [openProcessDialog, setOpenProcessDialog] = useState(false);
    const handleOpenProcessDialog = () => {
        if(rowSelectionModel.length <= 0){
            alert(`${type} 을(를) 선택해주세요.`);
            return;
        }
        setOpenProcessDialog(true);
    }
    const handleCloseProcessDialog = () => setOpenProcessDialog(false);

    const onClickProcessYesButton = () => {
        handleCloseProcessDialog();
        handleProcess(1);
    }
    const onClickProcessNoButton = () => {
        handleCloseProcessDialog();
        handleProcess(2);
    }

    const handleProcess = (status) => {
        try{
            for(let i=0; i<rowSelectionModel.length; i++){
                let url = `/${type}/${rowSelectionModel[i]}`;
                try{
                    fetch(url, {
                        method: "PATCH",
                        headers:{
                            'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                            'Content-Type': 'application/json; text=utf-8'
                        },
                        body: JSON.stringify({
                            reportId: rowSelectionModel[i],
                            reportStatus: status 
                        })
                    }).then(res => {
                        console.log(res);
                        if(!res.ok){
                            alert("처리 도중 에러가 발생했습니다.");
                            throw new Error("Process user error");
                        }
                    })
                } catch(error){
                    console.error(error);
                    break;
                }
            }
        } catch(error){
            console.error(error);
        }
        alert("처리가 완료되었습니다.");
        window.location.reload(type);
    }
    
    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                sx={{ mt:2, float:'left' }}
                onClick={handleOpenProcessDialog}
            >
                선택 처리
            </Button>

            <Dialog
            open={openProcessDialog}
            onClose={handleCloseProcessDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                {type} 처리
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    처리 방법을 선택해주세요
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickProcessYesButton} color="error">비공개 처리</Button>
                <Button onClick={onClickProcessNoButton} color="error">반려</Button>
                <Button onClick={handleCloseProcessDialog} color="error">취소</Button>
            </DialogActions>
            </Dialog>
        </>
    );
};