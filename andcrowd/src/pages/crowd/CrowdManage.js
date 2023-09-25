import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, FormControl, Select } from "@mui/material";
import '../../styles/crowd/CrowdManage.css';

const columns = [
    { 
        field: 'purchaseId', 
        headerName: 'ID', 
        width: 80
    },
    {
        field: 'userId', 
        headerName: '유저 ID',
        width: 80
    },
    {
        field: 'rewardName', 
        headerName: '리워드명',
        width: 140
    },
    {
        field: 'purchaseAmount', 
        headerName: '결제 금액 (₩)',
        width: 110
    },
    {
        field: 'purchaseStatus', 
        headerName: '주문 상태',
        width: 100
    },
    {
        field: 'purchaseDate', 
        headerName: '결제일',
        width: 120
    },
    {
        field: 'purchaseName', 
        headerName: '배송자명',
        width: 90
    },
    {
        field: 'purchasePhone', 
        headerName: '전화번호',
        width: 130
    },
    {
        field: 'purchaseAddress', 
        headerName: '배송주소',
        width: 150
    },
];


const CrowdManage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const [totalFunded, setTotalFunded] = useState(0);
    const [crowd, setCrowd] = useState({});
    const [rewardFundedList, setRewardFundedList] = useState([]);
    const [purchaseList, setPurchaseList] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [openProcessDialog, setOpenProcessDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [rewardList, setRewardList] = useState([]);
    const [mergedData, setMergedData] = useState([]);

    const NoRowsOverlay = () => (<p>비어있습니다.</p>);

    useEffect(() => {
        fetchCrowd();
        fetchTotalFunded();
        fetchRewardFunded();
        fetchPurchase();
        fetchReward();
    },[]);

    useEffect(() => {
    }, [rowSelectionModel]);


    const fetchTotalFunded = async () => {
        console.log(`/crowd_order/${crowdId}/total`);
        try{
            const response = await fetch(`/crowd_order/${crowdId}/total`);
            if(response.ok){
                const data = await response.json();
                console.log("fetchTotalFunded: ", data)
                setTotalFunded(data);
            } else {
                throw new Error(`Error fetchTotalFunded ${response.status} `);
            }
        } catch (error) {
          console.error("Error fetchTotalFunded data:", error);
        }
    };

    const fetchCrowd = async () => {
        try{
            const response = await fetch(`/crowd/${crowdId}`);
            if(response.ok){
                const data = await response.json();
                console.log("fetchCrowd: ", data)
                setCrowd(data);
            } else{
                throw new Error(`fetchCrowd error ${response.status} `);
            }
        } catch (error) {
          console.error("Error fetching Crowd data:", error);
        }
    };

    const fetchRewardFunded = async () => {
        console.log(`/crowd_order/${crowdId}/reward`);
        try{
            const response = await fetch(`/crowd_order/${crowdId}/reward`);
            if(response.ok){
                const data = await response.json();
                console.log("fetchRewardFunded:", data)
                setRewardFundedList(data);
            } else {
                throw new Error(`Error fetchRewardFunded ${response.status} `);
            }
        } catch (error) {
          console.error("Error fetchRewardFunded data:", error);
        }
    };

    const fetchReward = async () => {
        console.log(`/crowd/${crowdId}/reward`);
        try{
            const response = await fetch(`/crowd/${crowdId}/reward/all`);
            if(response.ok){
                const data = await response.json();
                console.log("fetchReward:", data)
                setRewardList(data);
            } else {
                throw new Error(`Error fetchReward ${response.status} `);
            }
        } catch (error) {
            console.error("Error fetchReward data:", error);
        }
    };

    useEffect(() => {
        // rewardList 기준으로 그룹화
        const groupedData = {};
    
        // rewardList 기준으로 그룹화
        rewardList.forEach((item) => {
          const rewardTitle = item.rewardTitle;
          if (!groupedData[rewardTitle]) {
            groupedData[rewardTitle] = {
              rewardCounts: 0,
              rewardSale: 0,
              rewardLimit: item.rewardLimit ||  0,
              data: [],
            };
          }
          groupedData[rewardTitle].data.push(item);
        });
    
        // rewardFundedList 데이터를 반영
        rewardFundedList.forEach((item) => {
          const rewardName = item.rewardName;
          if (groupedData[rewardName]) {
            groupedData[rewardName].rewardCounts += item.rewardCounts;
            groupedData[rewardName].rewardSale += item.rewardSale;
            groupedData[rewardName].rewardLimit += (item.rewardLimit || 0);
          } else {
            // rewardList 있지만 rewardFundedList 없는 경우
            groupedData[rewardName] = {
              rewardCounts: item.rewardCounts,
              rewardSale: item.rewardSale,
              rewardLimit: item.rewardLimit || 0,
              data: [],
            };
          }
        });
    
        // 그룹화된 데이터를 배열에 추가
        const mergedDataArray = [];
        for (const rewardName in groupedData) {
          mergedDataArray.push({
            rewardName: rewardName,
            rewardCounts: groupedData[rewardName].rewardCounts,
            rewardSale: groupedData[rewardName].rewardSale,
            rewardLimit: groupedData[rewardName].rewardLimit,
            data: groupedData[rewardName].data,
          });
        }
    
        // mergedData를 상태로 설정
        setMergedData(mergedDataArray);
      }, [rewardFundedList, rewardList]);
    

    const fetchPurchase = async () => {
        try{
            const response = await fetch(`/crowd_order/${crowdId}/list`);
            if(response.ok){
                const data = await response.json();
                console.log("fetchPurchase: ", data)
                setPurchaseList(data);
            } else {
                throw new Error(`Error fetchTotalFunded ${response.status} `);
            }
        } catch (error) {
          console.error("Error fetchTotalFunded data:", error);
        }
    }

    const handleOpenProcessDialog = () => {
        if(rowSelectionModel.length !== 1){
            alert(`한 개의 내역을 선택해주세요.`);
            return;
        }
        setOpenProcessDialog(true);
    }

    const handleCloseProcessDialog = () => setOpenProcessDialog(false);

    const handleChange = (event) => {
        console.log("new status: ",event.target.value);
        setNewStatus(event.target.value);
    };

    const handleProcess = () => {
        if(newStatus){
            let url = `/crowd_order/crowd/purchase/${rowSelectionModel[0]}/update/status`;
            let method = "PATCH";
            try{
                fetch(url, {
                    method: method,
                    headers:{
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                        'Content-Type': 'application/json; text=utf-8'
                    },
                    body: JSON.stringify({'purchaseStatus': newStatus})
                }).then(res => {
                    console.log(res);
                    if(res.ok) {
                        alert("업데이트 성공");
                        handleCloseProcessDialog();
                        setNewStatus('');
                        fetchPurchase();
                    } else {
                        alert("에러가 발생했습니다.");
                        setNewStatus('');
                    }
                })
            } catch(error){
                console.error(error);
            }
        } else {
            alert("유효한 옵션을 선택해주세요.");
        }
    }

    const onClickRewardAddButton = () => {
        navigate(`/crowd/${crowdId}/reward/update`)
    }

    return(
        <div className="crowdManage">
            <div className="manageTitle">
                <span id="manage-crowdTitle">'{crowd.crowdTitle}'</span>
            </div>
            <div className="topBox">
                <div className="overallStatus">
                    <div id="overall-left">
                        <p id="portion"><span id="totalFunded">{totalFunded}</span> / <span id="crowdGoal">{crowd.crowdGoal} 원</span></p>
                        <p id="description">(모인 금액 / 목표 금액)</p>
                        <p>총 결제 건수: <span id="total-purchase">{purchaseList.length}</span></p>
                    </div>
                    <div id="overall-right">
                        <div id="percent">{`${(totalFunded / parseFloat(crowd.crowdGoal) * 100).toFixed(1)}%`}</div>
                        <p id="achieved">달성 !</p>
                    </div>
                </div>
                <div className="rewardStatus">
                    <div>
                    <table id="reward-table">
                        <thead>
                            <tr>
                                <th id="reward-th">리워드명</th>
                                <th id="reward-th">판매/전체</th>
                                <th id="reward-th">총 금액 (₩)</th>
                            </tr>
                        </thead>
                        <tbody>
                        {mergedData.map((rewardFunded) => (
                            <tr id="reward-tr" key={rewardFunded.rewardId}>
                                <td id="reward-td">{rewardFunded.rewardName}</td>
                                <td id="reward-td">{rewardFunded.rewardCounts}/{rewardFunded.rewardLimit}</td>
                                <td id="reward-td">{rewardFunded.rewardSale}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            <Button sx={{float:'right'}} variant='outlined' onClick={onClickRewardAddButton}>리워드 관리</Button>
            <br/>

            <div className="purchaseStatus">
                <h3 id="purchase-title">결제 관리</h3>
                <DataGrid
                    slots={{noRowsOverlay: NoRowsOverlay}}
                    rows={purchaseList}
                    columns={columns}
                    getRowId={(row) => row.purchaseId} 
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 7},
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt:'2%', float:'right' }}
                    onClick={handleOpenProcessDialog}
                >
                    주문상태 업데이트
                </Button>
                <Dialog
                    open={openProcessDialog}
                    onClose={handleCloseProcessDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {rowSelectionModel[0]}번 주문 내역 업데이트
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            value={newStatus}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            >
                            <MenuItem value="">
                                <em>선택해주세요</em>
                            </MenuItem>
                            <MenuItem value={'결제대기'}>결제대기</MenuItem>
                            <MenuItem value={'결제완료'}>결제완료</MenuItem>
                            <MenuItem value={'결제취소'}>결제취소</MenuItem>
                            <MenuItem value={'배송준비'}>배송준비</MenuItem>
                            <MenuItem value={'배송중'}>배송중</MenuItem>
                            <MenuItem value={'배송완료'}>배송완료</MenuItem>
                            </Select>
                        </FormControl>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleProcess}>업데이트</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default CrowdManage;