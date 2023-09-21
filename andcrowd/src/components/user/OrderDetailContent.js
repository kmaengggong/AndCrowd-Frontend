import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const OrderDetailContent = ({userId}) => {
    const [orderDetails, setOrderDetails] = useState([]);

    const columns = [
        // {field: 'purchaseId', headerName: 'ID', width: 80},
        // {field: 'crowdId', headerName: '펀딩ID', width: 80},
        // {field: 'rewardId', headerName: '리워드ID', width: 100},
        {field: 'merchantUid', headerName: '주문번호', width: 200},
        {field: 'rewardName', headerName: '리워드 이름', width: 220},
        {field: 'purchaseName', headerName: '이름', width: 150},
        {field: 'purchasePhone', headerName: '전화번호', width: 130},
        {field: 'purchaseAddress', headerName: '주소', width: 100},
        {field: 'purchaseDate', headerName: '결제일', width: 180},
        {field: 'purchaseStatus', headerName: '결제상태', width: 180},
    ];

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try{
                await fetch(`/user/${userId}/order`)
                .then(res => {
                    return res.json();
                }).then(data => {
                    console.log(data);
                    setOrderDetails(data);
                })
            } catch(error){
                console.error(`/user/${userId}/order: ${error}`);
            }
        }

        fetchOrderDetails();
    }, []);

    const NoRowsOverlay = () => (<p>비어있습니다.</p>);

    return(
        <Box sx={{
            '& .deleted--true':{
                backgroundColor: '#F78181',
                color: "white"
            }
        }}>
            <DataGrid
                slots={{noRowsOverlay: NoRowsOverlay}}
                getRowId={(row) => row.purchaseId}
                rows={orderDetails}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10},
                    },
                    sorting: {
                        sortModel: [{ field: 'purchaseId', sort: 'desc' }],
                      },
                }}
                pageSizeOptions={[10, 20]}
            />
    </Box>
    );
};

export default OrderDetailContent;