import React, { useState, useEffect } from 'react';
import { Box, Typography, Popover, Button, Avatar, Link, Modal, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CountdownTimer from './CrowdTimer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import '../../styles/crowd/CrowdDetail.css'; // 파일 경로 수정
import { GetUserId } from '../user/GetUserId';
import Chip from '@mui/joy/Chip';
import { GetUserInfo } from '../user/GetUserInfo';
import report from '../../siren.png';
import share from '../../share.png';
import CrowdReward from '../../pages/crowd/CrowdReward';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
  p: 4,
};

const CrowdComponent = ({ }) => { // 컴포넌트 이름 변경
  const navigate = useNavigate();

  const params = useParams();
  const crowdId = params.crowdId; // 변수 이름 변경

  const [crowd, setCrowd] = useState({}); // 변수 이름 변경
  const [isLiked, setIsLiked] = useState(null);
  const [userId, setUserId] = useState(''); // 현재 로그인 중인 사용자 id
  const [crowdUserId, setCrowdUserId] = useState(null); // 모임글을 작성한 사용자 id
  const [isMember, setIsMember] = useState(false); // 멤버 여부
  const [members, setMembers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFollowed, setIsFollowed] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [crowdNeedNumApply, setCrowdNeedNumApply] = useState({}); // 변수 이름 변경
  const [totalSold, setTotalSold] = useState(0);

  const [openReport, setOpenReport] = useState(false);
  const [openModalItemId, setOpenModalItemId] = useState(null);
  const [reportContent, setReportContent] = useState("");
  const [reportData, setReportData] = useState({
    itemId: null,
    itemTitle: "",
  });

  const myId = GetUserId();

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
    fetchIsMember();
    loadMembers();
    fetchCrowdRoles();
    fetchNeedNumApplyData();
    fetchTotalSold();
  }, [crowdId, isLiked]);

  useEffect(() => {
    fetchIsFollowed(crowd.userId); // 변수 이름 변경
  }, [isFollowed]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}`); // 엔드포인트 수정

      if (response.ok) {
        const data = await response.json();
        console.log("data:: ",data)
        setCrowd(data); // 변수 이름 변경
        setCrowdUserId(data.userId); // 변수 이름 변경
        fetchIsFollowed(data.userId); // 변수 이름 변경
        GetUserInfo(data.userId, setUserInfo);
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching Crowd data:", error);
    }
  };

  const fetchCrowdRoles = async () => { // 함수 이름 변경
    try {
      const response = await fetch(`/crowd/${crowdId}/role/list`); // 엔드포인트 수정
      const jsonData = await response.json();
      console.log("fetchCrowdRoles: ", jsonData);

      // 서버에서 받은 데이터를 배열로 변환
      const rolesArray = Object.values(jsonData);
      setRolesData(rolesArray);
    } catch (error) {
      console.error('Error fetching crowd roles:', error);
    }
  };

  const fetchNeedNumApplyData = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}/applicant/neednum`); // 엔드포인트 수정

      if (response.ok) {
        const data = await response.json();
        console.log("fetchNeedNumApplyData: ", data);
        setCrowdNeedNumApply(data); // 변수 이름 변경
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching Crowd data:", error);
    }
  };

  const fetchTotalSold = async () => {
    try {
      const response = await fetch(`/crowd_order/${crowdId}/total`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("setTotalSold: ", data);
        setTotalSold(data);
      } else {
        throw new Error(`Fetching data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchIsMember = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}/check-member/${userId}`); // 엔드포인트 수정

      if (response.ok) {
        const data = await response.json();
        setIsMember(data);
        console.log(data);
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchIsLiked = async () => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/crowd/${crowdId}/like/${userId}`); // 엔드포인트 수정

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data);
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchLike = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}/like/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchIsLiked();
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMembers = async () => {
    try {
      console.log(`/crowd/${crowdId}/member/list`);
      const response = await fetch(`/crowd/${crowdId}/member/list/popup`); // 엔드포인트 수정
      if (response.ok) {
        const data = await response.json();
        console.log('memberdata: ', data);
        setMembers(data);
      } else {
        throw new Error(`Fetching members failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleOpenReportModal = (itemId) => {
    setOpenModalItemId(itemId);
  };

  const handleCloseReportModal = () => {
    setOpenModalItemId(null);
    setReportContent('');
  };

  const fetchReport = async (crowdId, reportContent) => { // 변수 이름 변경
    try {
      const myId = GetUserId();
      const requestBody = {
        userId: myId,
        projectId: crowdId,
        projectType: 0,
        reportContent: reportContent,
        reportStatus: 0,
      };
      console.log("requestBody: ", requestBody);

      const response = await fetch(`/crowd/report`, { // 엔드포인트 수정
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        setOpenReport(false);
        setReportContent('');
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClickMembers = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleMemberClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleClick = () => {
    fetchLike();
  };

  const crowdChat = (crowdId) => { // 함수 이름 변경
    navigate(`/crowd/${crowdId}/chat`); // 엔드포인트 수정
  };

  const applyCrowd = (crowdId) => { // 함수 이름 변경
    navigate(`/crowd/${crowdId}/payment`); // 엔드포인트 수정
  };

  const memberList = (crowdId) => { // 함수 이름 변경
    navigate(`/crowd/${crowdId}/member/list`); // 엔드포인트 수정
  };

  const fetchFollow = async (userId) => {
    try {
      const myId = GetUserId();
      const response = await fetch(`/user/${myId}/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newIsFollowed = !isFollowed; // 현재 상태를 반전시킴
        setIsFollowed(newIsFollowed);
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchIsFollowed = async (userId) => {
    try {
      const myId = GetUserId();
      console.log(`/user/${myId}/follow/${userId}`);
      const response = await fetch(`/user/${myId}/follow/${userId}`); // 엔드포인트 수정

      if (response.ok) {
        const data = await response.text(); // 응답 데이터 텍스트로 읽기
        console.log("fetchIsFollowed?? : ", data)

        if (data === '팔로우 된 유저입니다.') {
          setIsFollowed(true);
        }

      } else {
        setIsFollowed(false);
        console.log('팔로우 안된 유저입니다');
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
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

  return (
    <Box id='right-top-box'>
      <div className='catAndReport' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Chip variant="outlined" sx={{ mt: "7%", ml: "15%", fontWeight: 'light', color: '#787878' }}>
          {categoryMap[crowd.crowdCategoryId]} {/* 변수 이름 변경 */}
        </Chip>
        {crowd.andId !== 0 && (
          <Link id='and-link' href={`/and/${crowd.andId}`} underline="none">연계 모임글</Link>
        )}
        {crowd.andId === 0 && (
          <div id='and-link'></div>
        )}
        <button
          id="shareBtn"
          type='button'
          onClick={() => handleCopyClipBoard(`${window.location.origin}${window.location.pathname}`)}
          >
          <img id='share' src={share} alt="공유" />
        </button>
        <button id='report-button' onClick={() => handleOpenReportModal(crowd.crowdId)}>              
          <img id='report' src={report} alt="신고" />
        </button>
        <Modal
          key={crowd.crowdId} // 각 항목에 대한 고유한 모달을 위한 key
          open={openModalItemId === crowd.crowdId} // 해당 항목의 모달만 열린 상태
          onClose={handleCloseReportModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {`"${crowd.crowdTitle}"에 대한 신고`} {/* 변수 이름 변경 */}
            </Typography>
            <Box sx={{
              width: 500,
              maxWidth: '100%',
            }}>
              <TextField
                fullWidth
                id="standard-multiline-static"
                label="신고 사유"
                multiline
                rows={3}
                variant="standard"
                size="small"
                margin="normal"
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
              />
            </Box>
            <Button variant="outlined" color="error" sx={{ mt: 2 }}
              onClick={() => fetchReport(crowd.crowdId, reportContent)}>제출</Button> {/* 변수 이름 변경 */}
          </Box>
        </Modal>
      </div>
      <br />
      <div className='crowdTitle'> {/* 변수 이름 변경 */}
        <p id='crowd-title'>{crowd.crowdTitle}</p> {/* 변수 이름 변경 */}
      </div>
      <CountdownTimer publishedAt={crowd.publishedAt} crowdEndDate={crowd.crowdEndDate} /> {/* 변수 이름 변경 */}
      <div className='applyBox'>
        <p id='apply-title'>모인 금액</p>
        <p id='apply-number'>{`${totalSold} 원 (${(totalSold / parseFloat(crowd.crowdGoal) * 100).toFixed(1)}%)`}</p> {/* 변수 이름 변경 */}
      </div>
      <hr style={{ margin: '20px auto', width: '70%' }}></hr>
      <Box>
        <div className='crowdUser' style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ ml: 1, width: 45, height: 45, mt: 2 }} src={userInfo.userProfileImg} ></Avatar>
          <span id='crowdUser-nickname' onClick={() => handleMemberClick(crowdUserId)}>{userInfo.userNickname}</span> {/* 변수 이름 변경 */}
          <button id='follow' onClick={() => fetchFollow(crowd.userId)} // 변수 이름 변경
            className={isFollowed ? 'following-button' : 'follow-button'}>
            {isFollowed ? (
              <div> ✓ 팔로잉</div>
            ) : (
              <div> + 팔로우</div>
            )}
          </button>
        </div>
      </Box>
      <Box id='like-crowd-button'> {/* 변수 이름 변경 */}
        <Box id='like-icon' onClick={handleClick}>
          {isLiked ? (
            <AiFillHeart id='heart-icon' size={'30'} />
          ) : (
            <AiOutlineHeart id='heart-icon' size={'30'} />
          )}
          <Typography id='crowd-like'>{crowd.likeSum}</Typography> {/* 변수 이름 변경 */}
        </Box>
          <button id='go-payment' onClick={() => applyCrowd(crowd.crowdId)}>결제하기</button>
       
      </Box>
      {isMember && (
        <button id='go-chat' onClick={() => crowdChat(crowd.crowdId)}>채팅방으로 이동하기</button> 
      )}
      <button variant="text" aria-describedby={id} id='go-member' onClick={handleClickMembers}>
        ▼ 리워드
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className='rw-box'>
        <CrowdReward rewardId={crowd.rewardId} />
          
        </div>
      </Popover>
    </Box>
  );
};

export default CrowdComponent; // 컴포넌트 이름 변경