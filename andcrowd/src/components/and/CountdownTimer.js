import React from 'react';
import { LinearProgress, Typography } from '@mui/material';

const CountdownTimer = ({ publishedAt, andEndDate }) => {
  const startDate = new Date(publishedAt);
  const endDate = new Date(andEndDate);
  const now = new Date();

  const totalDuration = endDate - startDate;
  const elapsedDuration = now - startDate;

  let progressValue = (elapsedDuration / totalDuration) * 100;
  progressValue = Math.min(Math.max(progressValue, 0), 100);

  // Calculate remaining days
  const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 *24)) + 1;

  return (
    <div id ='linear-div'>
      <LinearProgress variant="determinate" value={progressValue} sx={{ 
          backgroundColor: 'white',
          marginTop:'17%',
          marginLeft:'16%',
          marginBottom:'2vh',
          width: '11vw', 
          height: '3vh', 
          borderRadius:'7px',
          border:'1px solid #00D337',
          "& .MuiLinearProgress-bar": {
            backgroundColor: '#00D337'
          }
        }} />
      <Typography id='and-remain-day' style={{ color: remainingDays <= 3 ? 'red' : 'inherit '}}>
        {`${remainingDays}일`} 남음
      </Typography>
    </div>
   );
};

export default CountdownTimer;
