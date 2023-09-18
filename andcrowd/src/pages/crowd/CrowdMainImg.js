import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from '@mui/material';

const CrowdMainImg = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // 3초마다 이미지 변경
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => {
      // 컴포넌트가 언마운트되면 타이머 정리
      clearInterval(intervalId);
    };
  }, [images]);

  return (
    <Carousel
      index={currentImageIndex}
      autoPlay={false} // 자동 재생 비활성화
      animation="slide" // 이미지 전환 애니메이션 설정
      timeout={500} // 전환 시간 (500ms)
      fullHeightHover={false} // 마우스 오버 시 화면 크기 유지 비활성화
    >
      {images.map((item, index) => (
        <Paper key={index} className={`slide-${index}`} style={{ backgroundColor: item.imageColor }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={`Image ${index + 1}`} />
        ) : (
          // 이미지가 없는 경우 배경 색상만 사용
          null
        )}
      </Paper>
      ))}
    </Carousel>
  );
};

export default CrowdMainImg;
