// 공지사항 페이지

import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Infoboard = () => {
    const [infoboard, setInfoboard] = useState([]);
    const columns = [
        {field: 'infoType', headerName: '종류', width: 100, headerClassName: 'header', sortable: false,
            valueGetter: (params) => params.value ? '공지사항' : '새소식'
        },
        {field: 'infoTitle', headerName: '제목', width: 300, flex:1, headerClassName: 'header', sortable: false}, 
        {field: 'publishedAt', headerName: '생성일', width: 150, headerClassName: 'header', sortable: false,
            valueGetter: (params) => params.value.replace('-', '년 ').replace('-', '월 ').split('T')[0] + '일'
        }
    ];

    const naviagte = useNavigate();

    useEffect(() => {
    }, [infoboard]);
    
    useState(() => {
        const fetchInfoboard = () => {
            try{
                fetch('/infoboard/list')
                .then((res) => {
                    return res.json();
                }).then(data => {
                    setInfoboard(data);
                });
            } catch(error){
                console.error(error);
            }
        };

        fetchInfoboard();
    }, []);

    const handleRowClick = (params) => {
        naviagte(`/infoboard/${params.id}`);
    }

    return (
        <Box sx={{
            marginX:3,
            '& .header':{
                backgroundColor: '#00D337',
                color: 'white'
            },
            '& .infoType--true':{
                backgroundColor: '#EFEFEF',
                fontWeight: 600
            }
        }}>
            <Typography sx={{fontSize:30, mt:5, mb: 5, textAlign:'center', fontWeight:700, color:'#00D337'}}>공지사항</Typography>

            <DataGrid
                getRowId={(row) => row.infoId}
                rows={infoboard}
                columns={columns}
                initialState={{
                    sorting:{
                        sortModel:[{
                            field: 'infoType',
                            sort: 'asc',
                        }]
                    },
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10},
                    },
                }}
                pageSizeOptions={[10, 20]}
                getCellClassName={(params) => {
                    return `infoType--${params.row.infoType}`;
                }}
                disableSort
                onRowClick={handleRowClick}
            />
        </Box>
    );
};

export default Infoboard;