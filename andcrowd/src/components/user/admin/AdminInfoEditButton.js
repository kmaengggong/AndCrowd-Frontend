import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

export const AdminInfoEditButton = ({type, userId, rowSelectionModel}) => {
    const [infoTitle, setInfoTitle] = useState(null);
    const [infoCotent, setInfoContent] = useState(null);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [info, setInfo] = useState([]);

    const onChangeInfoTitle = (event) => {
        event.preventDefault();
        setInfoTitle(event.target.value);
    };
    const onChangeInfoContent = (event) => {
        event.preventDefault();
        setInfoContent(event.target.value);
    };

    const handleOpenInfoDialog = () => {
        if(rowSelectionModel.length !== 1){
            alert("한 개의 공지사항을 선택해주세요.");
            return;
        }

        try{
            fetch(`/infoboard/${rowSelectionModel}`)
            .then(res => {
                return res.json();
            }).then(data => {
                setInfo(data);
            }).then(() => {
                if(info.infoType) info.infoType = 1;
                else info.infoType = 0;
                setOpenInfoDialog(true);
            })
        } catch(error){
            console.error(error);
        }
    }
    const handleCloseInfoDialog = () => setOpenInfoDialog(false);

    const onClickInfoEditButton = (event) => {
        event.preventDefault();
        handleCloseInfoDialog();

        try{
            fetch(`/${type}/${rowSelectionModel}/update`, {
                method: "PATCH",
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({
                    'userId': userId,
                    'infoTitle': infoTitle,
                    'infoContent': infoCotent
                })
            }).then((res) => {
                if(res.ok) alert("공지글 수정 성공");
                else alert("공지글 수정에 실패했습니다.");
                window.location.reload(type);
            });
        } catch(error){
            console.error(error);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="success"
                sx={{ mt:2, float:'left' }}
                onClick={handleOpenInfoDialog}
            >
                공지 글 수정
            </Button>
            <Dialog
                open={openInfoDialog}
                onClose={handleCloseInfoDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box component="form" onSubmit={onClickInfoEditButton}>

                <DialogTitle id="alert-dialog-title">
                    공지 글 수정
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        타입
                    </DialogContentText>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{info.infoType ? '공지사항' : '새소식'}</InputLabel>
                        <Select disabled />
                    </FormControl>
                    <DialogContentText id="alert-dialog-description">
                        제목
                    </DialogContentText>
                    <TextField className="login"
                        required
                        fullWidth
                        placeholder="제목"
                        onChange={onChangeInfoTitle}
                        autoFocus
                        defaultValue={info.infoTitle}
                    />
                    <DialogContentText id="alert-dialog-description">
                        내용
                    </DialogContentText>
                    <TextField className="login"
                        required
                        fullWidth
                        placeholder="내용"
                        onChange={onChangeInfoContent}
                        defaultValue={info.infoContent}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="error">수정</Button>
                    <Button onClick={handleCloseInfoDialog} color="error">아니오</Button>
                </DialogActions>

                </Box>
            </Dialog>
        </>
    );
};