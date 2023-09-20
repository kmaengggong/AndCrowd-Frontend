import React,{ useState, useEffect } from 'react';
import { Box, Typography, Popover, Button, Avatar, Link } from '@mui/material';
import { useNavigate,useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import '../../styles/and/AndDetail.css';
import { GetUserId } from '../user/GetUserId'; 
import Chip from '@mui/joy/Chip';
import { GetUserInfo } from '../user/GetUserInfo';


const AndComponent = ({ }) => {
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
  }
  
  const handleClick = () => {
    fetchLike();
  };
  const andChat = (andId) => {
    navigate(`/and/${andId}/chat`);
  };

  const applyAnd = (andId) => {
    navigate(`/and/${andId}/applicant/create`);
  };

  const memberList = (andId) => {
    navigate(`/and/${andId}/member/list`);
  };

  const fetchFollow = async (userId) => {
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


  return (
    <Box id='right-top-box'>
      <Chip variant="outlined" sx={{ mt: 1, fontWeight: 'light', color: '#787878' }}>
         {categoryMap[and.andCategoryId]}
      </Chip>
      <br />
      { and.crowdId !== 0 && (
      <Link href={`/crowd/${and.crowdId}`}>연계 펀딩글</Link>
      )}
      <Typography id='and-title'>{and.andTitle}</Typography>
      <CountdownTimer publishedAt={and.publishedAt} andEndDate={and.andEndDate} />
      <hr style={{ margin: '20px auto', width: '70%' }}></hr>
      <Box>
        <div className='andUser' style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ ml:1, width:45, height:45, mt: 2}} src={userInfo.userProfileImg} ></Avatar>
            <span id='andUser-nickname'>{userInfo.userNickname}</span>
            <button id='follow' onClick={() => fetchFollow(and.userId)}
              className={isFollowed ? 'following-button' : 'follow-button'}>
              {isFollowed ? (
                <div> ✓ 팔로잉</div>
              ) : (
                <div> + 팔로우</div>
                )}
            </button>
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
      { isMember && (
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
