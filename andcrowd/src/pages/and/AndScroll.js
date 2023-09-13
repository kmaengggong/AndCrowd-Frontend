import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import '../../styles/and/Feed.css';
import profileImg from './cat.jpg'
import mainImg from './shoes-8026038.jpg' 
import showMoreImg from './free-icon-show-more-button-with-three-dots-61140.png' 
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import {MenuItem, Popover, List, ListItem, Box, TextField, Button, Modal, IconButton } from '@mui/material';
import { Navigate ,useNavigate } from 'react-router-dom';
import { AiOutlineHeart  ,AiFillHeart} from "react-icons/ai";
import { GetUserId } from '../../components/user/GetUserId';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const 
AndScroll = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 2; // 페이지당 데이터 수
  const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
  const [categoryId, setCategoryId] = useState(0);
  const [sortField, setSortField] = useState('publishedAt');
  const [andStatus, setAndStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  
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
  }, [pageNumber, categoryId, andStatus, sortField, sortOrder]);

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
        andStatus: andStatus,
        sortField: sortField,
        sortOrder: "desc",
        searchKeyword: searchKeyword,
      });

      console.log("params: ", params.toString());
      const response = await fetch(`/and/scroll?${params.toString()}`);
      console.log("response: ", response);

      const jsonData = await response.json();

      console.log('jsonData:', jsonData);

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
      console.log("페이지 ", pageNumber)
    }
  };

  const handleSearch = () => {
    // 검색어가 비어있지 않은 경우에만 검색 요청을 보냅니다.
    if (searchKeyword) {
      setIsLastPage(false);
      setPageNumber(0);
      setSearchKeyword(searchKeyword.trim()); 
      // 검색 요청을 서버로 보내고 검색 결과를 업데이트합니다.
      fetchData({ searchKeyword });
    }
  };  

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
    setIsLastPage(false);
    setPageNumber(0); // 페이지 번호 초기화
    setData([]); // 기존 데이터 초기화
    fetchData(); // 새로운 정렬 기준으로 데이터 불러오기
  };

  const handleSortFieldChange = (newSortField) => {
    setSortField(newSortField);
    setPageNumber(0);
    setData([]);
    fetchData();
  };

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setPageNumber(0);
    setData([]); 
    fetchData(); 
  };
  
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
        handleLoadMore();
    }
  };
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
    
    const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000));

    return diffInDays >= 0 ? 'D - '+ diffInDays : '모집 마감';
}
const navigateToAndCreate = () => {
  navigate("/and/create");
};
  
  return (
    <div>
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

      <div>
        <Typography id ='category' onClick={handleClick2} style={{cursor: "pointer"}}>
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
        </Popover> 

      </div>
      <button id ='write' type="button" onClick={navigateToAndCreate}>글쓰기</button>
      <div>
        <input
          type="search"
          id="search"
          name="search"
          placeholder="모임 검색"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
    </div>
    

      {data ? (
        data.map(item => (
          
          <div key={item.andId} id ='feed-container'>
            <div id='feed-head'>
              <div id='img-box'>
                <img id='profile-img' src={profileImg} alt="profileImg" /> 
              </div>
              <div id='and-title-box'>
                <Typography id='and-feed-title'>{item.andTitle}</Typography>
                <div>
                <Typography id='and-end-date'>
                  {calculateRemainingDays(item.andEndDate)}
                </Typography>
              </div>
                <Typography id='user-id'>@{item.userId}</Typography>
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
              <img id='main-img' src={mainImg} alt="mainImg" /> 
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
          {`신고`}
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
    </div>
  );
};

export default AndScroll;
