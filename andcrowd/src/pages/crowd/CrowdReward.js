import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { TableHead } from "@mui/material";

// EditReward 컴포넌트는 앞서 제공한 EditReward 컴포넌트를 사용합니다.

const RewardList = () => {
  const params = useParams();
  const crowdId = params.crowdId;
  const rewardId = params.rewardId;
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    fetchData();
  }, [crowdId]);

  const fetchData = async () => {
    try {
        const response = await fetch(`/crowd/${crowdId}/reward/all`);
        if (response.ok) {
          const data = await response.json();
          // 가져온 데이터를 상태에 설정
          setRewards(data);
        } else {
          throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
        }
    } catch (error) {
        console.error("Error fetching AndBoard data:", error);
    }
  };

  return (
    <div>
      <h3>리워드 목록</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell>리워드명</TableCell>
            <TableCell>내용</TableCell>
            <TableCell>금액</TableCell>
            <TableCell>수량</TableCell>
          </TableHead>
          <TableBody>
            {rewards.map((reward, index) => (
              <TableRow key={index}>
                <TableCell>{reward.rewardTitle}</TableCell>
                <TableCell>{reward.rewardContent}</TableCell>
                <TableCell>{reward.rewardAmount}</TableCell>
                <TableCell>{reward.rewardLimit}개</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RewardList;
