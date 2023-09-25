import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from "react-router-dom";
import { TableHead } from "@mui/material";

const RewardList = () => {
  const params = useParams();
  const crowdId = params.crowdId;
  const [rewardList, setRewardList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const response = await fetch(`/crowd/${crowdId}/reward/all`);
        if (response.ok) {
          const data = await response.json();
          // 가져온 데이터를 상태에 설정
          setRewardList(data);
        } else {
          throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
        }
    } catch (error) {
        console.error("Error fetching AndBoard data:", error);
    }
  };

  // 숫자를 천 단위 콤마로 포맷팅하는 함수
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString();
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
            {rewardList.map((crowdReward) => (
              <TableRow key={crowdReward.rewardId}>
                <TableCell>{crowdReward.rewardTitle}</TableCell>
                <TableCell>{crowdReward.rewardContent}</TableCell>
                <TableCell>{formatNumberWithCommas(crowdReward.rewardAmount)}원</TableCell>
                <TableCell>{formatNumberWithCommas(crowdReward.rewardLimit)}개</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RewardList;
