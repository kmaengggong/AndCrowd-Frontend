import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {formatMoney,calculateAchievedRate,calculateRaisedAmount,countSponsors} from "../../pages/etc/Finance";
import axios from "axios";
import CrowdReward from "../../pages/crowd/CrowdReward.js";
import CrowdTimer from "../../components/crowd/CrowdTimer.js";
import styles from "../../styles/crowd/CrowdDetail.module.css";
import { method } from "lodash";
import { Chip } from "@mui/joy";
import { GetUserId } from "../user/GetUserId";
import { GetUserInfo } from "../user/GetUserInfo";

const CrowdComponent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const crowdId = params.crowdId;

  const [crowd, setCrowd] = useState({});
  const [isLiked, setIsLiked] = useState(null);
  const [userId, setUserId] = useState('');
  const [crowdUserId, setCrowdUserId] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedSection, setSelectedSection] = useState("crowdBoard");

  const categoryMap = {
    1: '문화 예술',
    2: '액티비티 스포츠',
    3: '테크 가전',
    4: '푸드',
    5: '언어',
    6: '여행',
    7: '반려동물',
    8: '기타',
  };

  useEffect(() => {
    setUserId(GetUserId());
    fetchIsLiked();
    fetchData();
  }, [crowdId, isLiked]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}`);

      if(response.ok) {
        const data = await response.json();
        setCrowd(data);
        setCrowdUserId(data.userId);
        GetUserInfo(data.userId, setUserInfo);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error){
      console.error("Error fetching And data:", error);
    }
  };

  const fetchIsLiked = async () => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/crowd/${crowdId}/like/${userId}`);

      if(response.ok) {
        const data = await response.json();
        setIsLiked(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchLike = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}/like/${userId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(response.ok) {
        fetchIsLiked();
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleClick = () => {
    fetchLike();
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (section === "board") {
      navigate(`/crowd/${crowdId}/board/all`);
    } else if (section === "qna") {
      navigate(`/crowd/${crowdId}/qna/all`);
    }
  };

  const updateCrowd = (crowdId) => {
    navigate(`/crowd/${crowdId}/update`);
  };

  const deleteCrowd = async (crowdId) => {
    const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }

    try {
        await axios.delete(`/crowd/${crowdId}/delete`);
        alert("펀딩글이 삭제되었습니다.");
        navigate(`/crowd/list`);
    } catch (error) {
        console.error('Error:', error.message);
    }
  };

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었어요.");
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateTimeString) => { // 타임스탬프에서 T 문구를 제거하는 함수
    if (!dateTimeString) return "";

    const formattedString = dateTimeString.replace("T", " ");

    return formattedString;
  };

  const [sponsor, setSponsor] = useState([]);

  useEffect(() => {
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

    fetchSponsorData();
  }, [crowdId]);

  const sponsorCount = crowd.crowdSponsor ? countSponsors(crowd.crowdSponsor) : 0;

  return (
    <Box id="rightSide">
      <Box>
        <Chip variant="outlined" sx={{ mt: 1, fontWeight: 'light', color: '#787878' }}>
          {categoryMap[crowd.crowdCategoryId]}
        </Chip>
        <button onClick={() => updateCrowd(crowd.crowdId)}>edit</button>
        <button onClick={() => deleteCrowd(crowd.crowdId)}>delete</button>
        <span className="shareBtn"
          onClick={() => handleCopyClipBoard(`${window.location.origin}${window.location.pathname}`)}>
          [공유]
        </span>
      </Box>
      <hr />
      <p>마감일: {formatDate(crowd.crowdEndDate)} 까지</p>
      <span>{calculateAchievedRate(crowd.currentAmount, crowd.totalAmount)}% 달성 | </span>
      <CrowdTimer publishedAt={crowd.publishedAt} crowdEndDate={crowd.crowdEndDate} />
      <br />
      <div>
        모인금액 : <span>{formatMoney(calculateRaisedAmount(crowd.crowdGoal, crowd.currentAmount))}원</span>
      </div>
      <span>{sponsorCount}명 참여</span>
      <hr />
      <div className={styles.rewardTitle}>
        **리워드 목록**
        <CrowdReward rewardId={crowd.rewardId} />
      </div>
    </Box>
  );
};

export default CrowdComponent;
