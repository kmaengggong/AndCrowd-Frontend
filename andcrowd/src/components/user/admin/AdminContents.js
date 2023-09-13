import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

export const AdminContents = ({type, isFetchUp, setIsFetchUp}) => {
    const columns = {
        user: [
            {field: 'userId', headerName: 'ID', width: 85},
            {field: 'role', headerName: '역할', width: 100},
            {field: 'userEmail', headerName: '이메일', width: 220},
            {field: 'userKorName', headerName: '이름', width: 100},
            {field: 'userNickname', headerName: '닉네임', width: 150},
            {field: 'userPhone', headerName: '전화번호', width: 130},
            {field: 'userBirth', headerName: '생일', width: 100},
            {field: 'userRegister', headerName: '가입일', width: 180},
            {field: 'userMarketing', headerName: '마케팅 동의', width: 150, valueGetter: (params) => params === '1' ? '동의' : '미동의'},
            {field: 'socialType', headerName: '소셜타입', width: 130},
            {field: 'socialId', headerName: '소셜ID', width: 120},
        ],
        and: [
            {field: 'andId', headerName: 'ID', width: 85},
            {field: 'isDeleted', headerName: '삭제여부', width: 100}, // 기능 추가 시 수정 필요
            {field: 'andStatus', headerName: '상태', width: 100,
                valueGetter: (params) =>
                    params === 0 ? '모집중' :
                    params === 1 ? '작성중' :
                    params === 2 ? '심사중' :
                    params === 3 ? '반려' : 
                    '모집종료'
            },
            {field: 'userId', headerName: '글쓴이', width: 100},
            {field: 'andCategoryId', headerName: '카테고리', width: 100},
            {field: 'andTitle', headerName: '제목', width: 100},
            {field: 'andContent', headerName: '내용', width: 100},
            {field: 'andEndDate', headerName: '마감일', width: 100},
            {field: 'needNumMem', headerName: '모집인원', width: 100},
            {field: 'publishedAt', headerName: '생성일', width: 100},
            {field: 'updatedAt', headerName: '수정일', width: 100},
            {field: 'andLikeCount', headerName: '좋아요', width: 100},
            {field: 'andViewCount', headerName: '조회수', width: 100},
        ]
    };

    const [list, setList] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeletedWell, setIsDeletedWell] = useState(true);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    useEffect(() => {
        fetchList();
    }, [type]);

    const fetchList = () => {
        fetch(`/${type}/list`, {
            method: "GET",
            headers:{
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json; text=utf-8'
            }
        }).then(res => {
            if(!res.ok) throw new Error(`Fetch list error: ${type}`);
            return res.json();
        }).then(data => {
            setList(data);
            setIsFetchUp(true);
            console.log(data);
            console.log(isFetchUp);
        });
    };

    const onClickDeleteYesButton = () => {
        handleCloseDeleteDialog();

        try{
            setIsDeletedWell(true);
            for(let i=0; i<rowSelectionModel.length; i++){
                try{
                    fetch(`/${type}/${rowSelectionModel[i]}`, {
                        method: "DELETE",
                        headers:{
                            'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                            'Content-Type': 'application/json; text=utf-8'
                        }
                    }).then(res => {
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
        window.location.reload();
    };

    return(
        <>
            {
            !isFetchUp ?
            <></>
            :
            <>
                {type === 'user' &&
                <DataGrid
                    getRowId={(row) => row.userId}
                    rows={list}
                    columns={columns[type]}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                />
                }
                {type === 'and' &&
                <DataGrid
                    getRowId={(row) => row.andId}
                    rows={list}
                    columns={columns[type]}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                />
                }
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
            }
        </>
    );
};