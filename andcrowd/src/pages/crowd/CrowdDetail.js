import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import styles from '../../styles/crowd/CrowdDetail.module.css';
import {formatMoney, getDaysBetweenDate, calculateAchievedRate, calculateRaisedAmount, countSponsors} from '../etc/Finance.js';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CrowdBoardList from "./CrowdBoardList";
import CrowdQnaList from "./CrowdQnaList";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import CrowdReward from "./CrowdReward";
import { Container } from "@mui/material";
import CrowdTimer from "../../components/crowd/CrowdTimer";

const CrowdDetail = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const [crowd, setCrowd] = useState({});
    const [selectedSection, setSelectedSection] = useState('crowdBoard');
    
    const [isOpened, setIsOpened] = useState(false);
    const [number, setNumber] = useState(0);
    const navigate = useNavigate();

    useEffect(() => { 
        fetchData();
    }, [crowdId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}`);
            if (response.ok) {
                const data = await response.json();
                setCrowd(data);
                console.log(data);
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSectionChange = (section) => { // 상세페이지 내부에서 board, qna 게시판 조회
        setSelectedSection(section);
        if (section === 'board') {
            navigate(`/crowd/${crowdId}/board/all`);
        } else if (section === 'qna') {
            navigate(`/crowd/${crowdId}/qna/all`);
        }
    };      

    const updateCrowd = (crowdId) => {
        navigate(`/crowd/${crowdId}/update`);
    };

    const deleteCrowd = async (crowdId) => {
        try{
            await axios.delete(`/crowd/${crowdId}/delete`);
            console.log(crowdId, "정상삭제");
            alert("펀딩글이 삭제되었습니다.");
            navigate(`/crowd/list`);
        } catch(error) {
            console.error(error);
        }
    };
    
    const handleCopyClipBoard = async (text) => { // 공유시 url복사
        try {
            await navigator.clipboard.writeText(text);
            alert("클립보드에 링크가 복사되었어요.");
        } catch (err) {
            console.log(err);
        }
    };
    
    const [sponsor, setSponsor] = useState([]);

    useEffect(() => {
        // Fetch supporters data here
        const fetchSponsorData = async () => {
        try {
            const response = await axios.get(`/crowd/${crowdId}/sponsor`);
            if (response.status === 200) {
                setSponsor(response.data);
            }
        } catch (error) {
            console.error("Error fetching supporters data:", error);
        }
        };

        // Call the function to fetch supporters data
        fetchSponsorData();
    }, [crowdId]);

    const sponsorCount = crowd.crowdSponsor ? countSponsors(crowd.crowdSponsor) : 0;// 후원자 수 카운트

    return (
        <div className={styles.crowdDetailContainer} id="container">
            <CrowdToolBar crowdId={crowd.crowdId} />
            <Container className='middleBar'>
                <div className={styles.imgContainer}>
                    <img src={crowd.headerImg} />1
                    <img src={crowd.crowdImg1} />2
                    <img src={crowd.crowdImg2} />3
                    <img src={crowd.crowdImg3} />4
                    <img src={crowd.crowdImg4} />5
                    <img src={crowd.crowdImg5} />6
                </div>
                <div className={styles.rightSide}>
                    <span>{crowd.crowdCategory}</span>
                    <button onClick={() => updateCrowd(crowd.crowdId)}>edit</button>
                    <button onClick={() => deleteCrowd(crowd.crowdId)}>delete</button>
                    <span className="shareBtn" onClick={() => handleCopyClipBoard(`${window.location.origin}${window.location.pathname}`)}>
                        [공유]
                    </span>
                    <hr />
                    <p>마감일:{crowd.crowdEndDate}</p>
                    <span>{calculateAchievedRate(crowd.currentAmount, crowd.totalAmount)}% 달성 | </span>
                    <CrowdTimer publishedAt={crowd.publishedAt} crowdEndDate={crowd.crowdEndDate}/>
                    <br />
                    <div>
                        모인금액 : 
                        <span>{formatMoney(calculateRaisedAmount(crowd.crowdGoal, crowd.currentAmount))}원</span>
                    </div>
                    <span>{countSponsors(crowd.crowdSponsor)}명 참여</span>
                    <hr />
                    <div className={styles.rewardTitle}>
                        **리워드 목록**
                        <CrowdReward rewardId={crowd.rewardId}/>
                    </div>   
                </div>
            </Container>
        </div>
    );
};

export default CrowdDetail;