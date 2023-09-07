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
  const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 *24));

  return (
    <div id ='linear-div'>
      <LinearProgress variant="determinate" value={progressValue} sx={{ 
          backgroundColor: 'white',
          marginTop:'10vh',
          marginLeft:'6vw',
          marginBottom:'2vh',
          width: '12vw', 
          height: '3vh', 
          borderRadius:'7px',
          border:'1px solid #00D337',
          "& .MuiLinearProgress-bar": {
            backgroundColor: '#00D337'
          }
        }} />
      <Typography id='remain' style={{ color: remainingDays <= 3 ? 'red' : 'inherit' }}>
        {`${remainingDays}일`} 남음
      </Typography>
    </div>
   );
};

export default CountdownTimer;
