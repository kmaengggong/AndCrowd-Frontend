import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import '../../styles/and/Feed.css';
import profileImg from './cat.jpg'
import mainImg from './shoes-8026038.jpg' 
import showMoreImg from './free-icon-show-more-button-with-three-dots-61140.png' 
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import {MenuItem, Popover, List, ListItem, Box, TextField, Button, Modal, IconButton, Grid, Paper } from '@mui/material';
import { Navigate ,useNavigate } from 'react-router-dom';
import { AiOutlineHeart  ,AiFillHeart} from "react-icons/ai";
import SearchIcon from '@mui/icons-material/Search';
import { GetUserId } from '../../components/user/GetUserId';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import SearchBar from '../../components/SearchBar';
import { getUserNickname, getUserProfileImg } from "../../components/and/userApi";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import cat0 from '../../category/all.png';
import cat1 from '../../category/art.png';
import cat2 from '../../category/sports.png';
import cat3 from '../../category/gadgets.png';
import cat4 from '../../category/bibimbap.png';
import cat5 from '../../category/languages.png';
import cat6 from '../../category/traveling.png';
import cat7 from '../../category/pets.png';
import cat8 from '../../category/etc.png';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const scrollToTop = () => {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  })
}
const 
AndScroll = ({ onSearch }) => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 2; // 페이지당 데이터 수
  const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
  const [categoryId, setCategoryId] = useState('');
  const [sortField, setSortField] = useState('publishedAt');
  const [sortStatus, setSortStatus] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  let loadingMore = false; // 중복 호출 방지를 위한 플래그
  
  const [isClicked, setIsClicked] = useState(false);
  const [rolesData, setRolesData] = useState({});

  const [isLiked, setIsLiked] = useState(null);

  const [isFollowed, setIsFollowed] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openModalItemId, setOpenModalItemId] = useState(null);
  const [reportContent, setReportContent] = useState("");
  const [reportData, setReportData] = useState({
    itemId: null,
    itemTitle: "",
  });
  
  const myId = GetUserId();

  const fetchIsLiked = async (andId) => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/and/${andId}/like/${userId}`);  
      if (response.ok) {
        const data = await response.json();
        return data; // 데이터 반환
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // 에러 발생 시 null 반환
    }
  }

  const fetchIsFollowed = async (userId) => {
    try {
      const myId = GetUserId();
      const response = await fetch(`/and/${myId}/follow/${userId}`);  
      if (response.ok) {
        const data = await response.json();
        return data; // 데이터 반환
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // 에러 발생 시 null 반환
    }
  }

  
  const fetchLike = async (andId) => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/and/${andId}/like/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const newIsLiked = await fetchIsLiked(andId); // fetchIsLiked 함수를 호출하여 새로운 isLiked 값을 가져옴
        if (newIsLiked !== null) {
          // 가져온 새로운 isLiked 값을 사용하여 해당 게시물의 좋아요 상태를 업데이트
          setIsLiked(prevIsLiked => ({
            ...prevIsLiked,
            [andId]: newIsLiked,
          }));

          // andLikeCount 값을 업데이트
          setData(prevData => prevData.map(item => {
            if (item.andId === andId) {
              // 해당 게시물의 andLikeCount 값을 업데이트
              return { ...item, andLikeCount: newIsLiked ? item.andLikeCount + 1 : item.andLikeCount - 1 };
            }
            return item;
          }));
        }
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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

  const handleOpenReportModal = (itemId) => {
    setOpenModalItemId(itemId);
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
        console.log("response.ok: ", response.ok)
        setOpen(false);
        setReportContent('');
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  const fetchAndRoles = async (id) => {
    try {
      const response = await fetch(`/and/${id}/role/list`);
      const jsonData = await response.json();
      setRolesData(prevState => ({ ...prevState, [id]: jsonData }));
    } catch (error) {
      console.error('Error fetching and roles:', error);
    }
    
  };

  useEffect(() => {
    fetchData();
    data.forEach(item => fetchAndRoles(item.andId));
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageNumber, categoryId, sortStatus, sortField, sortOrder]);

  useEffect(() => {
    const fetchDataAndSetIsLiked = async () => {
      const newIsLikedData = {}; // 새로운 데이터 객체 생성
  
      for (const item of data) {
        const newData = await fetchIsLiked(item.andId);
        if (newData !== null) {
          newIsLikedData[item.andId] = newData; // 데이터 업데이트
        }
      }
  
      setIsLiked(newIsLikedData); // 데이터 한꺼번에 업데이트
    };
  
    fetchDataAndSetIsLiked(); // 데이터 가져와서 업데이트하는 함수 호출
  }, [data]);

  useEffect(() => {
    const fetchDataAndSetIsFollowed = async () => {
      const newIsFollowedData = {}; // 새로운 데이터 객체 생성
  
      for (const item of data) {
        const newData = await fetchIsFollowed(item.userId);
        if (newData !== null) {
          newIsFollowedData[item.userId] = newData; // 데이터 업데이트
        }
      }
  
      setIsFollowed(newIsFollowedData); // 데이터 한꺼번에 업데이트
    };
  
    fetchDataAndSetIsFollowed(); // 데이터 가져와서 업데이트하는 함수 호출
  }, [data]);


  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: pageNumber,
        size: pageSize,
        andCategoryId: categoryId,
        andStatus: sortStatus,
        sortField: sortField,
        sortOrder: "desc",
        searchKeyword: searchKeyword,
      });

      console.log("params: ", params.toString());
      const response = await fetch(`/and/scroll?${params.toString()}`);
      console.log("response: ", response);

      const jsonData = await response.json();
      
      console.log('jsonData:', jsonData);

      // 작성자 닉네임을 가져와서 각 모임글의 작성자 컬럼을 업데이트
      for (const item of jsonData.content) {
        console.log(item);
        const userNickname = await getUserNickname(item.userId);
        console.log(userNickname);
        item.userNickname = userNickname;
      }

      // 작성자 닉네임을 가져와서 작성자 프로필 사진 컬럼을 업데이트
      for (const item of jsonData.content) {
        console.log(item);
        const profileImg = await getUserProfileImg(item.userId);
        console.log(profileImg);
        item.profileImg = profileImg;
      }

      // 다음 페이지가 있는지 여부를 업데이트
      
      // 검색 기준이 변경되었을 때, 기존 데이터 초기화
      if (pageNumber === 0) {
        setData(jsonData.content);
      } else {
        setData(prevData => [...prevData, ...jsonData.content]);
      }
      setIsLastPage(jsonData.last);
    } catch (error) {
    console.error('Error fetching data:', error);
    }
    
  };

  const handleLoadMore = () => {
    if (!isLastPage) {
      setPageNumber(pageNumber + 1);
    } else {
      console.log("LastPage!!");
    }
    loadingMore = false; // 호출 종료
  };
  

  const handleSearch = ( searchKeyword ) => {
    // 검색어가 비어있지 않은 경우에만 검색 요청을 보냅니다.
    if (searchKeyword) {
      setIsLastPage(false);
      setPageNumber(0);
      setSearchKeyword(searchKeyword.trim()); 
      // 검색 요청을 서버로 보내고 검색 결과를 업데이트합니다.
      // fetchData({ searchKeyword });
    }
  };  

  const handleCategoryChange = (newCategoryId) => {
    console.log("newCategoryId: ", newCategoryId)
    setCategoryId(newCategoryId);
    setIsLastPage(false);
    setPageNumber(0); // 페이지 번호 초기화
    setData([]); // 기존 데이터 초기화
    // fetchData(); // 새로운 정렬 기준으로 데이터 불러오기
  };

  const handleSortFieldChange = (newSortField) => {
    setSortField(newSortField);
    setPageNumber(0);
    setData([]);
    // fetchData();
  };

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setPageNumber(0);
    setData([]); 
    // fetchData(); 
  };

  const handleSortStatusChange = (event) => {
    const { name, value } = event.target;
    setSortStatus(Number(value));
    setPageNumber(0);
    setData([]);
    // fetchData();
  };

  
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {

    if (!isLastPage && !loadingMore) { // 중복 호출 방지
      loadingMore = true; // 호출 중으로 표시
      handleLoadMore();
    } else {
      console.log("isLastPage true");
    }
  }
  };

  useEffect(() => {
    handleScroll();
    // 스크롤 이벤트 리스너 추가
  window.addEventListener("scroll", handleScroll);

  // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [isLastPage]); // isLastPage 값이 변경될 때마다 이펙트 재실행
    
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick1 = (event, itemId) => {
    setAnchorEl1(event.currentTarget);
    setOpenModalItemId(itemId);
  };

  const handleClose1 = () => {
    setAnchorEl1 (null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2 (null);
  };

  function calculateRemainingDays(andEndDate) {
    const now = new Date();
    const end = new Date(andEndDate);
    const diffInMs = end - now;
    
    const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000)) + 1;

    return diffInDays >= 0 ? 'D - '+ diffInDays : '모집 마감';
}
const navigateToAndCreate = () => {
  navigate("/and/create1");
};
  
  return (
    <div>
      <div className='category'>
      <Box sx={{ flexGrow: 1 }}>
        <div className='itemContainer'>
          <div className='item' onClick={()=>handleCategoryChange(0)}>
              <img id='cat-img' src={cat0} alt="전체" />
              <span>전체</span>
            </div>
          <div className='item' onClick={()=>handleCategoryChange(1)}>
            <img id='cat-img' src={cat1} alt="문화/예술" />
            <span>문화/예술</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(2)}>
            <img id='cat-img' src={cat2} alt="액티비티" />
            <span>액티비티</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(3)}>
            <img id='cat-img' src={cat3} alt="테크/가전" />
            <span>테크/가전</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(4)}>
            <img id='cat-img' src={cat4} alt="푸드" />
            <span>푸드</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(5)}>
            <img id='cat-img' src={cat5} alt="언어" />
            <span>언어</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(6)}>
            <img id='cat-img' src={cat6} alt="여행" />
            <span>여행</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(7)}>
            <img id='cat-img' src={cat7} alt="반려동물" />
            <span>반려동물</span>
          </div>
          <div className='item' onClick={()=>handleCategoryChange(8)}>
            <img id='cat-img' src={cat8} alt="기타" />
            <span>기타</span>
          </div>
        </div>
      </Box>
      </div>
      <div id='feed-top'>
      <Typography className={`sortOption ${sortField === 'publishedAt' ? 'selected' : ''}`}
        onClick={() => handleSortFieldChange('publishedAt')}
      >
        최신순
      </Typography>

      <Typography className={`sortOption ${sortField === 'andViewCount' ? 'selected' : ''}`}
         onClick={() => handleSortFieldChange('andViewCount')}
       >
         인기순
       </Typography>
      
      <Typography className={`sortOption ${sortField === 'andEndDate' ? 'selected' : ''}`}
        onClick={() => handleSortFieldChange('andEndDate')}
      >
        마감임박순
      </Typography>

      <Typography className={`sortOption ${sortField === 'andLikeCount' ? 'selected' : ''}`}
        onClick={() => handleSortFieldChange('andLikeCount')}
      >
        좋아요순
      </Typography>

      <select
        name='sortStatus'
        value={sortStatus}
        onChange={handleSortStatusChange}
        id = 'and-sortStatus'
      >
        <option value="1">모집중</option>
        <option value="2">반려</option>
        <option value="3">종료</option>
        <option value="4">작성중</option>
        <option value="0">심사중</option>
      </select>

      <div>
        {/*<Typography id ='category' onClick={handleClick2} style={{cursor: "pointer"}}>
          카테고리
        </Typography>
        
        <Popover 
          open={Boolean(anchorEl2)}
          anchorEl={anchorEl2}
          onClose={handleClose2}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <List>
            {["0", "1", "2", "3", "4", "5"].map((optionValue, index) => (
              <ListItem 
                button 
                key={index} 
                selected={categoryId === optionValue} 
                onClick={() => {
                  handleCategoryChange(optionValue);
                  handleClose2();
                }}
              >
                {optionValue}
              </ListItem>
            ))}
          </List>
              </Popover> */}

      </div>
      <button id ='write' type="button" onClick={navigateToAndCreate}>글쓰기</button>
      
      
    </div>
    {/*<div id='and-search-bar'>
        <input
          type="search"
          id="and-search"
          name="search"
          placeholder="모임 검색"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button  id='and-search-button' onClick={handleSearch}><SearchIcon id='search-icon' /></button>
            </div> */}

      {data ? (
        data.map(item => (
          
          <div key={item.andId} id ='feed-container'>
            <div id='feed-head'>
              <div id='img-box'>
              {item.profileImg ? (
                <img id='profile-img' src={item.profileImg} alt="profileImg" />
              ) : (
                <div id='profile-img'>
                <AccountCircleIcon sx={{ width: "4vw", height: "4vw", color: "grey" }} /> 
                </div>
              )}              
              </div>
              <div id='and-title-box'>
                <Typography id='and-feed-title'>{item.andTitle}</Typography>
                <div>
                <Typography id='and-end-date'>
                  {calculateRemainingDays(item.andEndDate)}
                </Typography>
              </div>
                <Typography id='user-id'>@{item.userNickname}</Typography>
              </div>
              
              <div id='showmore-button-box'>
              <button id='follow' onClick={() => fetchFollow(item.userId)}
                className={isFollowed[item.userId] ? 'following-button' : 'follow-button'}>
                {isFollowed[item.userId] ? (
                  <div>팔로잉</div>
                ) : (
                  <div>팔로우</div>
                  )}
              </button>
              <img id='show-more-img' src={showMoreImg} alt="showMoreImg" aria-controls="simple-menu" aria-haspopup="true" 
                onClick={() => handleOpenReportModal(item.andId)} />
              </div>
              {/* <Menu
                id="simple-menu"
                anchorEl={anchorEl1}
                keepMounted
                open={Boolean(anchorEl1)}
                onClose={handleClose1}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                elevation={0}
              >
                <div id='menu-box'>
                  <MenuItem 
                    className='menu' 
                    id='report-menu' 
                    onClick={() => handleOpenReportModal(item.andId)}
                  >{item.andId}번 글 신고하기</MenuItem>
                  {console.log("item.andId::: ", item.andId)}
                  <MenuItem className='menu' id='share-menu' onClick={handleClose1}>공유하기</MenuItem>
                </div>
              </Menu> */}
            </div>
            <div id='main-img-box'>
            <Link to={`/and/${item.andId}`}>
              <img id='main-img' src={item.andHeaderImg} alt="mainImg" /> 
            </Link>
            </div>
            <div id='feed-bottom'>
            <div id='and-role-box'>
              {rolesData[item.andId]?.map((roleObj, index) => (
              <Typography id='and-role' key={index}>#{roleObj.andRole}</Typography>
              ))}
            </div>
            <div onClick={() => fetchLike(item.andId)}>
            {isLiked[item.andId] ? (
                <AiFillHeart id='heart-icon' size={"25"}/>
              ) : (
                <AiOutlineHeart id='heart-icon' size={"25"}/>
              )}
            </div>
            <Typography id='and-like'>{item.andLikeCount}</Typography>
            </div>
            <div id='bottom-gap'></div>
          </div>
        ))
      ) : (
        <div>데이터가 없습니다.</div>
      )}

      {data.map(item => (
      <Modal
        key={item.andId} // 각 항목에 대한 고유한 모달을 위한 key
        open={openModalItemId === item.andId} // 해당 항목의 모달만 열린 상태
        onClose={handleCloseReportModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          {`"${item.andTitle}"에 대한 신고`}
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
            onClick={() => fetchReport(item.andId, reportContent)}>제출</Button>
        </Box>
      </Modal>
      ))}
    
      {isLastPage && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <p>마지막 페이지입니다.</p>
        </div>
      )}
      <button id="top" onClick={scrollToTop} type="button" > <KeyboardArrowUpRoundedIcon /></button>
    </div>
  );
};

export default AndScroll;
