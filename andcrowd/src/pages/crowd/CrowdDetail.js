import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import styles from '../../styles/crowd/CrowdDetail.module.css';
import {formatMoney, getDaysBetweenDate, calculateAchievedRate, calculateRaisedAmount, countSponsors} from '../etc/Finance.js';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CrowdBoardList from "./CrowdBoardList";
import CrowdQnaList from "./CrowdQnaList";

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

    const [contributionAmount, setContributionAmount] = useState(0);
    const [selectedReward, setSelectedReward] = useState(null);
    const [rewards, setRewards] = useState([]);

    // const toggleOptionMenu = () => {
    //     setIsOpened(!isOpened);
    //     };
    
    //     const Increase5000 = () => {
    //     setNumber(number + 5000);
    //     };
    
    //     const Increase10000 = () => {
    //     setNumber(number + 10000);
    //     };
    
    //     const Increase50000 = () => {
    //     setNumber(number + 50000);
    //     };
    
    //     const Increase100000 = () => {
    //     setNumber(number + 100000);
    //     };
    
    //     const handleAlert = () => {
    //     alert('후원해주셔서 감사합니다!🥳');
    // };
    
    useEffect(() => {
        // Crowd의 리워드 목록을 가져오는 HTTP 요청
        axios.get(`/crowd/${crowdId}/reward/list`)
        .then(response => {
            setRewards(response.data);
        })
        .catch(error => {
            console.error('리워드를 불러오는 중 에러 발생:', error);
        });
    }, [crowdId]);

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
            <div className={styles.centerBar}>
                <Link to={`/crowd/detail/${crowd.crowdId}`}>{/* 링크에 crowdId추가 */}
                <button>상세정보</button>
                </Link>
                <button onClick={() => handleSectionChange('board')}>게시판</button>
                <button onClick={() => handleSectionChange('qna')}>QnA</button>
                <hr />
                {crowd.crowdTitle && ( // crowd.crowdTitle이 존재할 때만 출력
                    <h1>제목{crowd.crowdTitle}</h1>
                )}
                <div>
                    {crowd.crowdContent && ( // crowd.crowdContent가 존재할 때만 출력
                        <p>본문{crowd.crowdContent}</p>
                    )}
                </div>
            </div>
            <div className={styles.middleBar}>
                <div>
                {selectedSection === 'board' && <CrowdBoardList crowdId={crowdId} />} {/* BoardSection을 렌더링합니다 */}
                {selectedSection === 'qna' && <CrowdQnaList crowdId={crowdId} />} {/* QnaSection을 렌더링합니다 */}
                </div>
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
                    <span>{getDaysBetweenDate(crowd.publishedAt, crowd.crowdEndDate)}일 남음</span>
                    <br />
                    <div>
                        모인금액 : 
                        <span>{formatMoney(calculateRaisedAmount(crowd.crowdGoal, crowd.currentAmount))}원</span>
                    </div>
                    <span>{countSponsors(crowd.crowdSponsor)}명 참여</span>
                    <hr />
                    <div className={styles.rewardTitle}>
                        **리워드 목록**
                    </div>
                    <div>
                        {/* rewardList */}
                        <div>
                            <h2>금액만 후원하고 싶다면?</h2>
                            <input
                                type="number"
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(Number(e.target.value))}
                            />
                            <Grid item xs="auto">
                                <Button onClick={() => setContributionAmount(contributionAmount + 5000)}>+5,000</Button>
                                <Button onClick={() => setContributionAmount(contributionAmount + 10000)}>+10,000</Button><br />
                                <Button onClick={() => setContributionAmount(contributionAmount + 50000)}>+50,000</Button>
                                <Button onClick={() => setContributionAmount(contributionAmount + 100000)}>+100,000</Button>
                            </Grid>
                        </div>
                        <ul>
                        {rewards.map((reward) => (
                            <li key={reward.rewardId}>
                            <h4>{reward.rewardAmount}</h4>
                            <span>{reward.rewardTitle}</span>
                            <span>{reward.rewardContent}</span>
                            {/* 리워드 상세 정보를 보여주는 버튼 */}
                            </li>
                            ))}
                        </ul>
                    </div>    
                </div>
            </div>
        </div>
    );
};

export default CrowdDetail;