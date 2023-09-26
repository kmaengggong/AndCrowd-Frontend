import React,{ useState, useEffect } from 'react';
import { Box, Typography, Popover, Button, Avatar, Link, Modal, TextField } from '@mui/material';
import { useNavigate,useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import '../../styles/and/AndDetail.css';
import { GetUserId } from '../user/GetUserId'; 
import Chip from '@mui/joy/Chip';
import { GetUserInfo } from '../user/GetUserInfo';
import report from '../../siren.png';
import axios from "axios";
import { useIsLoginState } from "../../context/isLoginContext";

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


const AndComponent = ({ }) => {
  const isLogin = useIsLoginState();
  const navigate = useNavigate();

  const params = useParams();
  const andId = params.andId;

  const [and, setAnd] = useState({});
  const [isLiked, setIsLiked] = useState(null);
  const [userId, setUserId] = useState(''); // 현재 로그인 중인 사용자 id
  const [andUserId, setAndUserId] = useState(null); // 모임글을 작성한 사용자 id
  const [isMember, setIsMember] = useState(false); // 멤버 여부
  const [members, setMembers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFollowed, setIsFollowed] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [andNeedNumApply, setAndNeedNumApply] = useState({});
  
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
    fetchAndRoles();
    fetchNeedNumApplyData();
  }, [andId, isLiked]);

  useEffect(() => {
    fetchIsFollowed(and.userId);
  }, [isFollowed]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnd(data);
        setAndUserId(data.userId);
        fetchIsFollowed(data.userId);
        GetUserInfo(data.userId, setUserInfo);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  
  };

  const fetchAndRoles = async () => {
    try {
      const response = await fetch(`/and/${andId}/role/list`);
      const jsonData = await response.json();
      console.log("fetchAndRoles: ",jsonData);
      
      // 서버에서 받은 데이터를 배열로 변환
      const rolesArray = Object.values(jsonData);
      setRolesData(rolesArray);
    } catch (error) {
      console.error('Error fetching and roles:', error);
    }
  };
  

  const fetchNeedNumApplyData = async () => {
    try {
      const response = await fetch(`/and/${andId}/applicant/neednum`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("fetchNeedNumApplyData: ",data)
        setAndNeedNumApply(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
};

  const fetchIsMember = async () =>{
    try {
      const response = await fetch(`/and/${andId}/check-member/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsMember(data);
        console.log(data)
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  const fetchIsLiked = async () => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/and/${andId}/like/${userId}`);
      
      if (response.ok) {
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
      const response = await fetch(`/and/${andId}/like/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchIsLiked();
     } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  const loadMembers = async () => {
    try {
      console.log(`/and/${andId}/member/list`);
      const response = await fetch(`/and/${andId}/member/list/popup`);
      if (response.ok) {
        const data = await response.json();
        console.log('memberdata: ', data)
        setMembers(data);
      } else {
        throw new Error(`Fetching members failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleOpenReportModal = (itemId) => {
    if(!isLogin){
      alert("신고는 로그인 후 사용 가능합니다.")
    } else{
    setOpenModalItemId(itemId);
    }
  };

  const handleCloseReportModal = () => {
    setOpenModalItemId(null);
    setReportContent(''); // 모달이 닫힐 때 신고 내용 초기화
  };

  const fetchReport = async (andId, reportContent) => {
    try {
      const myId = GetUserId();
      const requestBody = {
        userId: myId,
        projectId: andId,
        projectType: 0,
        reportContent: reportContent,
        reportStatus: 0
      };
      console.log("requestBody: ",requestBody);
  
      const response = await fetch(`/and/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });      
      if (response.ok) {
        alert("신고가 정상적으로 접수되었습니다. \n빠른 시일 내로 확인 후 조취하겠습니다.")
        handleCloseReportModal();
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleClickMembers = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleMemberClick = (userId) => {
    if(!isLogin){
      alert("멤버 페이지 이동은 로그인 후 사용 가능합니다.")
    } else{
    navigate(`/user/${userId}`);
    }
  }
  
  const handleClick = () => {
    if(!isLogin){
      alert("찜하기는 로그인 후 사용 가능합니다.")
    } else{
    fetchLike();
    }
  };
  const andChat = (andId) => {
    navigate(`/and/${andId}/chat`);
  };

  const applyAnd = (andId) => {
    if(!isLogin){
      alert("모임 지원을 위해서는 먼저 로그인해주세요.")
    } else{
    navigate(`/and/${andId}/applicant/create`);
    }
  };

  const memberList = (andId) => {
    navigate(`/and/${andId}/member/list`);
  };

  const fetchFollow = async (userId) => {
    if(!isLogin){
      alert("팔로우는 로그인 후 사용 가능합니다.")
    } else{
    try {
      const myId = GetUserId();
      const response = await fetch(`/and/${myId}/follow/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const newIsFollowed = await fetchIsFollowed(userId); 
        if (newIsFollowed !== null) {
          setIsFollowed(prevIsFollowed => ({
            ...prevIsFollowed,
            [userId]: newIsFollowed,
          }));
        }
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    }
  }

  const fetchIsFollowed = async (userId) => {
    try {
      const myId = GetUserId();
      console.log(`/and/${myId}/follow/${userId}`);
      const response = await fetch(`/and/${myId}/follow/${userId}`);  
      if (response.ok) {
        const data = await response.json();
        console.log("data follow: ",data);
        setIsFollowed(data);
        return data; // 데이터 반환
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // 에러 발생 시 null 반환
    }
  }

  const updateAnd = (andId) => {
    navigate(`/and/${andId}/update`);
  };

  const deleteAnd = async (andId) => {
    // 확인 대화 상자를 표시하고 사용자의 선택 결과를 받음
    const isConfirmed = window.confirm("정말로 모임글을 삭제하시겠습니까?");
  
    // 사용자가 확인을 선택한 경우 게시물 삭제
    if (isConfirmed) {
      try {
        await axios.delete(`/and/${andId}/delete`);
        console.log("Deleted and with ID:", andId);
        navigate(`/and/scroll`);
      } catch (error) {
        console.error("error in deleting and:", error);
      }
    } else {
      // 사용자가 취소를 선택한 경우 아무 작업도 수행하지 않음
      console.log("게시물 삭제가 취소되었습니다.");
    }
  };
  
  const manageAnd = (andId) => {
    navigate(`/and/${andId}/manage`);
  };


  return (
    <Box id='right-top-box'>
      <div className='catAndReport'>
      <Chip variant="outlined" sx={{ mt: "7%", ml: "15%", fontWeight: 'light', color: '#787878' }}>
         {categoryMap[and.andCategoryId]}
      </Chip>
      { and.crowdId !== 0 && (
      <Link id='crowd-link' href={`/crowd/${and.crowdId}`} underline="none">연계 펀딩글</Link>
      )}
      { and.crowdId == 0 && (
      <div id='crowd-link'></div>
      )}
      <button id='report-button' onClick={() => handleOpenReportModal(and.andId)}>              
        <img id='report' src={report} alt="신고" />
      </button>
      <Modal
        key={and.andId} // 각 항목에 대한 고유한 모달을 위한 key
        open={openModalItemId === and.andId} // 해당 항목의 모달만 열린 상태
        onClose={handleCloseReportModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          {`"${and.andTitle}"에 대한 신고`}
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
          <Button variant="outlined" color="error" sx={{ mt:2 }}
            onClick={() => fetchReport(and.andId, reportContent)}>제출</Button>
        </Box>
      </Modal>
      </div>
      <br />
      <div className='andTitle'>
        <p id='and-title'>{and.andTitle}</p>
      </div>
      <CountdownTimer publishedAt={and.publishedAt} andEndDate={and.andEndDate} />
      <div className='applyBox'>
        <p id='apply-title'>신청자</p>
        <p id='apply-number'>{`${andNeedNumApply.totalApplicantNum}/${andNeedNumApply.needNumMem} (${(andNeedNumApply.totalApplicantNum / andNeedNumApply.needNumMem * 100).toFixed(1)}%)`}</p>
      </div>
      <div className='roleBox'>  
        {rolesData.map((role) => (
          <p id='roles' key={role.andRoleId}>
            #{role.andRole}
          </p>
        ))}
      </div>
      <hr style={{ margin: '20px auto', width: '70%' }}></hr>
      <Box>
          <div className='andUser' style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ ml:1, width:45, height:45, mt: 2}} src={userInfo.userProfileImg} ></Avatar>
              <span id='andUser-nickname' onClick={() => handleMemberClick(andUserId)}>{userInfo.userNickname}</span>
              
              { userId !== andUserId ? (
              <button id='follow' onClick={() => fetchFollow(and.userId)}
                className={isFollowed ? 'following-button' : 'follow-button'}>
                {isFollowed ? (
                  <div> ✓ 팔로잉</div>
                ) : (
                  <div> + 팔로우</div>
                  )}
              </button>
                      ) : (
                        <div id='and-user-button'>
                            <div id='and-detail-bottom'>
                              <Typography id='and-detail-up'
                                onClick={() => updateAnd(andId, andId)}
                              >
                                수정
                              </Typography>
                              <Typography id='and-detail-de'
                                onClick={() => deleteAnd(andId, andId)}
                              >
                                삭제
                              </Typography>
                            </div>
                            <div id='and-detail-bottom2'>
                              <Typography id='and-detail-2'
                                onClick={() => manageAnd(and.andId)}
                              >
                                관리                           
                              </Typography> 
                            </div>
              
                        </div>
                      )
                    }
              
          </div>
      </Box>
      <Box id='like-and-button'>
        <Box id='like-icon' onClick={handleClick}>
          {isLiked ? (
            <AiFillHeart id='heart-icon' size={'30'} />
          ) : (
            <AiOutlineHeart id='heart-icon' size={'30'} />
          )}
          <Typography id='and-like'>{and.andLikeCount}</Typography>
        </Box>
        { and.andStatus == "1" && (
        <button id='go-and' onClick={() => applyAnd(and.andId)}>모임 참가하기</button>
        )}
      </Box>
      {isMember && (and.andStatus === 1 || and.andStatus === 3) && (
        <button id='go-chat' onClick={() => andChat(and.andId)}>채팅방으로 이동하기</button>
      )}
      <button variant="text" aria-describedby={id} id ='go-member' onClick={handleClickMembers}>
        ▼ 참여중인 멤버
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
        <div className='box'>
          {members.map((member, index) => (
            <div 
              id='members'
              key={index} 
              onClick={() => handleMemberClick(member.userId)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr:1, width:35, height:36 }} alt="member_img" src={member.userProfileImg} />
                  <p id='member'>{member.userNickname}</p>
                </div>
            </div>
          ))}
        </div>
      </Popover>
    </Box>
  );
};

export default AndComponent;
