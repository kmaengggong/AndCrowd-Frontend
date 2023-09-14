import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
            {field: 'userMarketing', headerName: '마케팅 동의', width: 150, 
                valueGetter: (params) => 
                    params.value === 0 ? '미동의' : '동의'
            },
            {field: 'socialType', headerName: '소셜타입', width: 130},
            {field: 'socialId', headerName: '소셜ID', width: 120},
        ],
        and: [
            {field: 'andId', headerName: 'ID', width: 85},
            {field: 'andStatus', headerName: '상태', width: 100,
                valueGetter: (params) => 
                    params.value === 0 ? '모집중' :
                    params.value === 1 ? '작성중' :
                    params.value === 2 ? '심사중' :
                    params.value === 3 ? '반려' : 
                    '모집종료'
            },
            {field: 'userId', headerName: '글쓴이', width: 120},
            {field: 'andCategoryId', headerName: '카테고리', width: 130},
            {field: 'andTitle', headerName: '제목', width: 150},
            {field: 'andContent', headerName: '내용', width: 150},
            {field: 'andEndDate', headerName: '마감일', width: 115},
            {field: 'needNumMem', headerName: '모집인원', width: 130},
            {field: 'publishedAt', headerName: '생성일', width: 115},
            {field: 'updatedAt', headerName: '수정일', width: 115},
            {field: 'andLikeCount', headerName: '좋아요', width: 120},
            {field: 'andViewCount', headerName: '조회수', width: 120},
            {field: 'deleted', headerName: '삭제여부', width: 130},
            {field: 'crowdId', headerName: '펀딩ID', width: 115},
        ],
        crowd: [
            {field: 'crowdId', headerName: 'ID', width: 85},
            {field: 'crowdStatus', headerName: '상태', width: 100,
                valueGetter: (params) => 
                    params.value === 0 ? '심사중' :
                    params.value === 1 ? '펀딩중' :
                    params.value === 2 ? '반려' :   
                    '모집 종료'
            },
            {field: 'userId', headerName: '글쓴이', width: 120},
            {field: 'crowdCategoryId', headerName: '카테고리', width: 130},
            {field: 'crowdTitle', headerName: '제목', width: 150},
            {field: 'crowdContent', headerName: '내용', width: 150},
            {field: 'crowdEndDate', headerName: '마감일', width: 115},
            // {field: 'need', headerName: '펀딩수', width: 110},
            // {field: 'needNumMem', headerName: '모금액', width: 120},
            {field: 'crowdGoal', headerName: '목표금액', width: 130},
            {field: 'publishedAt', headerName: '생성일', width: 115},
            {field: 'updatedAt', headerName: '수정일', width: 115},
            {field: 'likeSum', headerName: '좋아요', width: 120},
            {field: 'viewCount', headerName: '조회수', width: 120},
            {field: 'deleted', headerName: '삭제여부', width: 130},
            {field: 'andId', headerName: '모임ID', width: 115},
        ],
        report: [
            {field: 'reportId', headerName: 'ID', width: 85},
            {field: 'reportStatus', headerName: '신고상태', width: 130,
                valueGetter: (params) => 
                params.value === 0 ? '처리중' :
                params.value === 1 ? '처리완료' :
                '반려'
            },
            {field: 'projectType', headerName: '종류', width: 95,
                valueGetter: (params) => 
                params.value === 0 ? '모임' : '펀딩'
            },
            {field: 'projectId', headerName: '프로젝트ID', width: 140},
            {field: 'reportContent', headerName: '신고내용', width: 150},
            {field: 'userId', headerName: '신고자', width: 115},
            {field: 'reportDate', headerName: '신고일', width: 115},
        ],
        infoboard: [
            {field: 'userId', headerName: 'ID', width: 85},
        ]
    };

    const [list, setList] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeletedWell, setIsDeletedWell] = useState(true);
    const handleOpenDeleteDialog = () => {
        if(rowSelectionModel.length <= 0){
            alert(`${type} 을(를) 선택해주세요.`);
            return;
        }
        setOpenDeleteDialog(true);
    }
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const [openProcessDialog, setOpenProcessDialog] = useState(false);
    // const [isDeletedWell, setIsDeletedWell] = useState(true);
    const handleOpenProcessDialog = () => {
        if(rowSelectionModel.length <= 0){
            alert(`${type} 을(를) 선택해주세요.`);
            return;
        }
        setOpenProcessDialog(true);
    }
    const handleCloseProcessDialog = () => setOpenProcessDialog(false);

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
                let url = `/${type}/${rowSelectionModel[i]}`;
                let method = "DELETE";
                if(type === 'and'  || type ==='crowd'){
                    url += `/delete`;
                }
                if(type === 'crowd') method = "PATCH";

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
            // setIsProcessWell(true);
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
                            // setIsDeletedWell(false);
                            alert("처리 도중 에러가 발생했습니다.");
                            throw new Error("Process user error");
                        }
                    })
                } catch(error){
                    // setIsDeletedWell(false);
                    console.error(error);
                    break;
                }
            }
        } catch(error){
            console.error(error);
        }
        // if(isDeletedWell)
        alert("처리가 완료되었습니다.");
        window.location.reload(type);
    }

    const NoRowsOverlay = () => (<p>비어있습니다.</p>);

    return(
        <>
            {
            !isFetchUp ?
            <></>
            :
            <Box sx={{
                '& .deleted--true':{
                    backgroundColor: '#F78181',
                    color: "white"
                }
            }}>
                <DataGrid
                    slots={{noRowsOverlay: NoRowsOverlay}}
                    getRowId={(row) => {
                        if(type === 'user') return row.userId;
                        else if(type === 'and') return row.andId;
                        else if(type === 'crowd') return row.crowdId;
                        else if(type === 'report') return row.reportId;
                        else if(type === 'infoboard') return row.crowdId;
                    }}
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
                    getCellClassName={(params) => {
                        return `deleted--${params.row.deleted}`;
                    }}
                />

                {
                    type === 'report' ?
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
                    :
                    <></>
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
            </Box>
            }
        </>
    );
};