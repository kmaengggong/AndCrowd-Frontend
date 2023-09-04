import React, { useState, useEffect } from "react";
import { redirect, useLocation, useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../../styles/crowd/CrowdDetail.module.css";
import axios from "axios";

const CrowdDetail = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const navigate = useNavigate();
    const [crowd, setCrowd] = useState({});
    
    useEffect(() => {
        fetchData();
    }, [crowdId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/detail/${crowdId}`);
            if(response.ok) {
                const data = await response.json();
                setCrowd(data);
            } else {
                throw new Error(`Error: ${response.status}.`);
            }
        } catch (error) {
            // console.error(error);
        }
    };

    const insertCrowd = (crowdId) => { // 업로드
        navigate(`/crowd/create`);
    };

    const updateCrowd = (crowdId) => { // 수정
        navigate(`/crowd/${crowdId}/update`); 
    };

    const deleteCrowd = async (crowdId) => { // 삭제
        try {
            await axios.delete(`/crowd/${crowdId}/delete`);
            navigate(`/crowd/list`);
        } catch (error) {
            console.error(error);
        }
    };

    if(crowd.deleted === true) { // 삭제 후 
        alert("펀딩글이 삭제되었습니다.");
        window.location.href = `/crowd/list`;
    };

    const location = useLocation();
    const handleCopyClipBoard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("클립보드에 링크가 복사되었어요.");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.crowdDetailContainer} id="container">
            <div className={styles.leftSide}>
                <Link to={`/crowd/${crowd.crowdId}/detail`}>{/* 링크에 crowdId추가 */}
                <button>상세정보</button>
                </Link>
                <Link to={`/crowd/${crowd.crowdId}/board/${crowd.crowdBoardId}`}>
                <button>게시판</button>
                </Link>
                <Link to={`/crowd/${crowd.crowdId}/qna/${crowd.crowdQnaId}`}>
                <button>QnA</button>
                </Link>
                <hr />
                <div className={styles.imgContainer}>
                    <Link>
                        <div className={styles.Img1}>{/* crowdImg 1 */}</div>
                    </Link>
                    <div className={styles.Img2}>{/* crowdImg 2 */}</div>
                    <div className={styles.Img3}>{/* crowdImg 3 */}</div>
                    <div className={styles.Img4}>{/* crowdImg 4 */}</div>
                    <div className={styles.Img5}>{/* crowdImg 5 */}</div>
                </div>
            </div>
            <hr />
            <div className={styles.rightSide}>
                <span>카테고리</span>
                <span className="shareBtn" onClick={() => handleCopyClipBoard(`${"http://localhost:3000"}${location.pathname}`)}>
                    [공유]
                </span>
                <hr />
                <h1>프로젝트 제목</h1><br/>
                <span>{/* (현재 모인금액/총 금액)*100 */}% 달성 | </span><span>{/* 남은일수 */}일 남음</span>
                <br />
                <span>{/* 목표금액 - 미달액 */}원 달성 | </span><span>{/* 후원자 수 count */}명 참여</span> 
                <hr />
                <div className={styles.rewardTitle}>
                    **리워드 목록**
                </div>
                <br />               
            </div>

        </div>
    );
};

export default CrowdDetail;