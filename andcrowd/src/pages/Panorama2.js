import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../styles/Panorama.css";
import MyPageCard from "../components/user/MyPageCard";
import AndSearchCard from "../components/and/AndSearchCard";
const Panorama = ({num}) => {
  const [data, setData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 0,
          size: 8,
          andCategoryId: '',
          andStatus: 1,
          sortField: 'andViewCount',
          sortOrder: "desc",
          searchKeyword: '',
        });

        const response = await fetch(`/and/scroll?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonData = await response.json();
        setJsonData(jsonData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="panorama">
      <div className="scene">
        <div className="card">
          <div className="card-inner">
            <div className="card-front">
              {jsonData && <AndSearchCard project={jsonData.content[1]} type={"and"} />}
            </div>
            <div className="card-back">
              {jsonData && <AndSearchCard project={jsonData.content[1]} type={"and"} />}
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
