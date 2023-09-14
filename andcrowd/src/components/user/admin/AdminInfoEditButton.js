import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

export const AdminInfoEditButton = ({type, userId, rowSelectionModel}) => {
    const [infoType, setInfoType] = useState('');
    const [infoTitle, setInfoTitle] = useState(null);
    const [infoCotent, setInfoContent] = useState(null);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);

    useState(() => {

    }, []);

    const onChangeInfoType = (event) => {
        event.preventDefault();
        setInfoType(event.target.value);
    };
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
        setOpenInfoDialog(true);
    }
    const handleCloseInfoDialog = () => setOpenInfoDialog(false);

    const onClickInfoCreateButton = () => {
        console.log(rowSelectionModel);
        handleCloseInfoDialog();
        try{
            fetch(`/${type}/create`, {
                method: "POST",
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({
                    'userId': userId,
                    'infoType': infoType,
                    'infoTitle': infoTitle,
                    'infoContent': infoCotent
                })
            }).then((res) => {
                if(res.ok) alert("공지글 작성 성공");
                else alert("공지글 작성에 실패했습니다.");
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
                <DialogTitle id="alert-dialog-title">
                    공지 글 수정
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        타입
                    </DialogContentText>
                    <FormControl fullWidth>
                        <Select
                            defaultValue={rowSelectionModel.infoType}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={onChangeInfoType}
                            value={infoType}
                        >
                            <MenuItem value={1}>공지사항</MenuItem>
                            <MenuItem value={0}>새소식</MenuItem>
                        </Select>
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
                        value={rowSelectionModel.infoTitle}
                    />
                    <DialogContentText id="alert-dialog-description">
                        내용
                    </DialogContentText>
                    <TextField className="login"
                        required
                        fullWidth
                        placeholder="내용"
                        onChange={onChangeInfoContent}
                        value={rowSelectionModel.infoContent}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickInfoCreateButton} color="error">작성</Button>
                    <Button onClick={handleCloseInfoDialog} color="error">아니오</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};