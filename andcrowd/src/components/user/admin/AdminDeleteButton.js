import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

export const AdminDeleteButton = ({type, rowSelectionModel}) => {
    const [isDeletedWell, setIsDeletedWell] = useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        if(rowSelectionModel.length <= 0){
            alert(`${type} 을(를) 선택해주세요.`);
            return;
        }
        setOpenDeleteDialog(true);
    }
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const onClickDeleteYesButton = () => {
        handleCloseDeleteDialog();
        try{
            setIsDeletedWell(true);
            for(let i=0; i<rowSelectionModel.length; i++){
                let url = `/${type}/${rowSelectionModel[i]}`;
                let method = "DELETE";
                if(type === 'and'  || type ==='crowd'){
                    url += `/delete`;
                }
                if(type === 'crowd' || type === 'infoboard'){
                    method = "PATCH";
                }
                
                try{
                    fetch(url, {
                        method: method,
                        headers:{
                            'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                            'Content-Type': 'application/json; text=utf-8'
                        }
                    }).then(res => {
                        console.log(res);
                        if(!res.ok){
                            setIsDeletedWell(false);
                            alert("삭제 도중 에러가 발생했습니다.");
                            throw new Error("Delete user error");
                        }
                    })
                } catch(error){
                    setIsDeletedWell(false);
                    console.error(error);
                    break;
                }
            }
        } catch(error){
            console.error(error);
        }
        if(isDeletedWell) alert("삭제가 완료되었습니다.");
        window.location.reload(type);
    };

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                sx={{ mt:2, float:'right' }}
                onClick={handleOpenDeleteDialog}
            >
                선택 삭제
            </Button>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {type} 삭제
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        정말로 삭제하시겠습니까??
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickDeleteYesButton} color="error">예</Button>
                    <Button onClick={handleCloseDeleteDialog} color="error">아니오</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};