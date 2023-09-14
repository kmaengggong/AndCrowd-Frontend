import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {formatMoney, calculateAchievedRate, calculateRaisedAmount, countSponsors} from '../../pages/etc/Finance';
import axios from "axios";
import CrowdReward from "../../pages/crowd/CrowdReward.js";
import CrowdTimer from "../../components/crowd/CrowdTimer.js";
import styles from '../../styles/crowd/CrowdDetail.module.css';

const CrowdComponent = ({}) => {
    const params = useParams();
    const crowdId = params.crowdId;

    const navigate = useNavigate();
    const [crowd, setCrowd] = useState({});
    const [selectedSection, setSelectedSection] = useState('crowdBoard');
    
    // const [isOpened, setIsOpened] = useState(false);
    // const [number, setNumber] = useState(0);

    useEffect(() => {
        fetchData();
    },[crowdId]);

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
            console.error('Error:', error.message);
            console.error('Response:', error.response);
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

    const formatDate = (dateTimeString) => { // 날짜, 시간 사이의 TimeZone 표시 제거
        if (!dateTimeString) return ""; 
      
        const formattedString = dateTimeString.replace("T", " ");
      
        return formattedString;
    };

    const fetchData = async () => {
        try{
            const response = await fetch(`/crowd/${crowdId}`);
            if(response.ok) {
                const data = await response.json();
                setCrowd(data);
            } else {
                throw new Error(`Fetching and data failed with status ${response.status}.`);
            }
        }catch(error){
            console.error(error);
        }
    };

    // const handleClick = () => {
    //     setIsClicked(!isClicked);
    // };

    const [sponsor, setSponsor] = useState([]); // 스폰서 관련

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

    return(
        <Box id='rightSide'>
            <span>{crowd.crowdCategory}</span>
            <button onClick={() => updateCrowd(crowd.crowdId)}>edit</button>
            <button onClick={() => deleteCrowd(crowd.crowdId)}>delete</button>
            <span className="shareBtn" onClick={() => handleCopyClipBoard(`${window.location.origin}${window.location.pathname}`)}>
                [공유]
            </span>
            <hr />
            <p>마감일: {formatDate(crowd.crowdEndDate)} 까지</p>
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
        </Box>
    )
}

export default CrowdComponent;