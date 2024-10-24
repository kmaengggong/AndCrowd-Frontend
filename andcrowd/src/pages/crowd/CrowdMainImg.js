import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";

const CrowdMainImg = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 3초마다 이미지 변경
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      // 컴포넌트가 언마운트되면 타이머 정리
      clearInterval(intervalId);
    };
  }, [images]);

  const navigateToCrowd = (crowdId) => {
    navigate(`/crowd/${crowdId}`);
  };

  return (
  <Carousel
    index={currentImageIndex}
    autoPlay={false}
    animation="slide"
    timeout={500}
    fullHeightHover={false}
  >
    {images.map((item, index) => (
      <div key={index} className={`slide-${index}`} onClick={() => navigateToCrowd(item.crowdId)}
        style={{ display: "flex", background: "#ffff", cursor: "pointer" }}>
        {item.headerImg ? (
          <img
            src={item.headerImg}
            alt={`Image ${index + 1}`}
            style={{
              width: "auto",
              height: "200px",
              objectFit: "contain",
              flexShrink: 0, 
            }}
          />
        ) : null}
      <div className="text-overlay" style={{ marginLeft: "20px", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", overflow: "hidden" }}>
        <span style={{ fontSize: "170%", fontWeight: "bold", textAlign: "center", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.crowdTitle}</span>
      </div>
      </div>
    ))}
  </Carousel>
  );
};

export default CrowdMainImg;
