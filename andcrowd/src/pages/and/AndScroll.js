import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import '../../styles/and/Feed.css';
import profileImg from './cat.jpg'
import mainImg from './shoes-8026038.jpg' 
import showMoreImg from './free-icon-show-more-button-with-three-dots-61140.png' 
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import {MenuItem, Popover, List, ListItem } from '@mui/material';
import { Navigate ,useNavigate } from 'react-router-dom';
import { AiOutlineHeart  ,AiFillHeart} from "react-icons/ai";

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
  const navigate = useNavigate();
  
  const [isClicked, setIsClicked] = useState(false);
  const [rolesData, setRolesData] = useState({});

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const fetchAndRoles = async (id) => {
    try {
      const response = await fetch(`/and/${id}/role/list`);
      const jsonData = await response.json();
      console.log(jsonData);
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
  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: pageNumber,
        size: pageSize,
        andCategoryId: categoryId,
        andStatus: andStatus,
        sortField: sortField,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/and/scroll?${params.toString()}`);
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

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
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

    return diffInDays >= 0 ? 'D - '+ diffInDays : '기간 만료';
}
const navigateToAndCreate = () => {
  navigate("/and/create");
};
  
  return (
    <div>
      <div id='feed-head'>
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
            {["1번", "2번", "3번", "4번", "5번"].map((optionValue, index) => (
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
    </div>
    

      {data ? (
        data.map(item => (
          
          <div key={item.andId} id ='feed-container'>
            <div id='feed-head'>
              <div id='img-box'>
                <img id='profile-img' src={profileImg} alt="profileImg" /> 
              </div>
              <div>
                <Typography id='and-title'>{item.andTitle}</Typography>
                <Typography id='user-id'>@{item.userId}</Typography>
              </div>
              <div>
                <Typography id='and-end-date'>
                  {calculateRemainingDays(item.andEndDate)}
                </Typography>
              </div>
              <button id='follow'>팔로우</button>
              <img id='show-more-img' src={showMoreImg} alt="showMoreImg" aria-controls="simple-menu" aria-haspopup="true" 
                onClick={handleClick1} />
              <Menu
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
              <MenuItem class ='menu' id='report-menu' onClick={handleClose1}>신고하기</MenuItem>
              <MenuItem class ='menu' id='share-menu' onClick={handleClose1}>공유하기</MenuItem>
              </div>
              </Menu>
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
            <div onClick={handleClick}>
              {isClicked ? <AiFillHeart id='heart-icon' size={"25"}/> : <AiOutlineHeart id='heart-icon' size={"25"}/>}
            </div>
            <Typography id='and-like'>{item.andLikeCount}</Typography>
            
            </div>
            <div id='bottom-gap'></div>
          </div>
        ))
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    
      {isLastPage && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <p>마지막 페이지입니다.</p>
        </div>
      )}
    </div>
  );
};

export default AndScroll;
