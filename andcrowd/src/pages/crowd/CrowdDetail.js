import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/crowd/CrowdDetail.module.css';
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import CrowdRightBox from "../../components/crowd/CrowdRightBox";
import axios from "axios";

const CrowdDetail = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const [crowd, setCrowd] = useState({});

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}`);
            if(response.ok) {
                const data = await response.json();
                setCrowd(data);
                console.log("전달된 데이터:",data);
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { 
        fetchData();
    }, [crowdId]);

    return (
        <div>
        <CrowdToolBar crowdId={crowd.crowdId} />
        <div className={styles.crowdDetailContainer} id="container">
            <div className='middleBar'/>
            <div className={styles.leftSide}>
                <div className={styles.imgContainer}>
                    <h1>{crowd.crowdTitle}</h1>
                    <div id='crowd-content-dt' dangerouslySetInnerHTML={{ __html :  crowd.crowdContent  }}></div> <br />
                    <hr/>
                </div>
                <div className={styles.rightBox}>
                    <CrowdRightBox />
                </div>
            </div>
        </div>
        </div>
    );
};

export default CrowdDetail;