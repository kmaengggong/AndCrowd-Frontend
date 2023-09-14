import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AdminDeleteButton } from './AdminDeleteButton';
import { AdminReportProcessButton } from './AdminReportProcessButton';
import { AdminInfoCreateButton } from './AdminInfoCreateButton';
import { GetUserId } from '../GetUserId';
import { AdminInfoEditButton } from './AdminInfoEditButton';

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
            {field: 'infoId', headerName: 'ID', width: 85},
            {field: 'userId', headerName: '글쓴이', width: 115},
            {field: 'infoType', headerName: '종류', width: 100,
                valueGetter: (params) => 
                params.value === true ? '공지사항' : '새소식'
            },
            {field: 'infoTitle', headerName: '제목', width: 150},
            {field: 'infoContent', headerName: '내용', width: 150},
            {field: 'publishedAt', headerName: '생성일', width: 115},
            {field: 'updatedAt', headerName: '수정일', width: 115},
            {field: 'deleted', headerName: '삭제여부', width: 130},
        ]
    };

    const [userId, setUserId] = useState(null);
    const [list, setList] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    useEffect(() => {
        setUserId(GetUserId());
    }, []);

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
        });
    };

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
                        else if(type === 'infoboard') return row.infoId;
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

                {type === 'infoboard' ?
                    <>
                        <AdminInfoCreateButton type={type} userId={userId} />
                        <AdminInfoEditButton type={type} userId={userId} rowSelectionModel={rowSelectionModel} />
                    </>
                    :
                    <></>
                }

                {type === 'report' ?
                    <AdminReportProcessButton type={type} rowSelectionModel={rowSelectionModel}/>
                    :
                    <></>
                }

                <AdminDeleteButton type={type} rowSelectionModel={rowSelectionModel}/>
            </Box>
            }
        </>
    );
};