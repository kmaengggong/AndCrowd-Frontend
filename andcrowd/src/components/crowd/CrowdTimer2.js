import React from 'react';

const CrowdTimer2 = ({ crowdBoard }) => {
  const publishedAt = new Date(crowdBoard.publishedAt);
  const now = new Date();

  const timeDiff = now - publishedAt;

  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

  const daysDiff = Math.floor(hoursDiff / 24);

  return (
    <div>
      {hoursDiff < 1 && (
        <p id='time-text'>방금 전</p>
      )}

      {hoursDiff >= 1 && hoursDiff <= 23 && (
        <p id='time-text'>{hoursDiff}시간 전</p>
      )}

      {daysDiff >= 1 && (
        <p id='time-text'>{daysDiff}일 전</p>
      )}
    </div>
  );
};

export default CrowdTimer2;
