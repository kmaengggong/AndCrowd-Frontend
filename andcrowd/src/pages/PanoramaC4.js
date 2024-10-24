import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../styles/Panorama.css";
import AndSearchCard from "../components/and/AndSearchCard";
import MyPageCard from "../components/user/MyPageCard";

const Panorama = () => {
  const [jsonData, setJsonData] = useState(null);
  useEffect(() => {
    const fetchPopularCrowd = async () => {
      try {
        const response = await fetch('/crowd/popular/top5');
        const jsonData = await response.json();
        console.log("fetchPopularCrowd: ", jsonData);
        setJsonData(jsonData);
      } catch (error) {
        console.error('Error fetching popular crowd:', error);
      }
    };

    fetchPopularCrowd(); 

  }, []);

  return (
    <div className="panorama">
      <div className="scene">
        <div className="card">
          <div className="card-inner">
            <div className="card-front">
              {jsonData && jsonData && jsonData.length > 0 && (
                <MyPageCard project={jsonData[3]} type={"order"} />
              )}
            </div>
            <div className="card-back">
              {jsonData && jsonData && jsonData.length  > 0 && (
                <MyPageCard project={jsonData[3]} type={"order"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Panorama.propTypes = {
  contentNum: PropTypes.number.isRequired,
};

export default Panorama;
