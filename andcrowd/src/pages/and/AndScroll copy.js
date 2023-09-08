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
import debounce from 'lodash/debounce';


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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const fetchAndRoles = async (id) => {
    try {
      const response = await fetch(`/and/${id}/role/list`);
      const jsonData = await response.json();
      // console.log("fetchAndRoles: ",jsonData);
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
    fetchData();
  }, [pageNumber, categoryId]);
  

  useEffect(() => {
    // setIsLastPage를 업데이트할 때 로그를 찍습니다.
    console.log("useEffect isLastPage: ", isLastPage);
  }, [isLastPage]); // isLastPage가 변경될 때만 실행

  const fetchData = async (newQueryParams = {}) => {
    try {
      const newPageNumber = newQueryParams.page || pageNumber;
      const newCategoryId = newQueryParams.categoryId || categoryId;

      const params = new URLSearchParams({
        page: newQueryParams.page || pageNumber,
        size: pageSize,
        andCategoryId: categoryId,
        andStatus: andStatus,
        sortField: sortField,
        sortOrder: sortOrder,
        searchKeyword: searchKeyword,
        ...newQueryParams,
      });

      console.log("params: ",params.toString())

      if (isFetching) {
        // 이미 요청 중인 경우, 추가 요청을 방지합니다.
        return;
      }
  
      setIsFetching(true); // 데이터 요청 시작

      const response = await fetch(`http://localhost:8080/and/scroll?${params.toString()}`);
      console.log("response: ", response)
      const jsonData = await response.json();

      console.log('jsonData:', jsonData);
      console.log('jsonData.last:', jsonData.last);
      
      // // 검색 기준이 변경되었을 때, 기존 데이터 초기화
      // if (newPageNumber === 0) {
      //   setData(jsonData.content);
      // } else {
      //   setData(prevData => [...prevData, ...jsonData.content]);
      // }

      // 검색 기준이 변경되었을 때, 기존 데이터 초기화
      if (newPageNumber === 0) {
        setData(jsonData.content);
      } else {
        setData(prevData => {
          const uniqueData = prevData.concat(jsonData.content.filter(item => !prevData.some(existingItem => existingItem.andId === item.andId)));
          return uniqueData;
        });
      }

      // 다음 페이지가 있는지 여부를 업데이트
      setIsLastPage(jsonData.last);
      console.log("isLastPage: ", isLastPage)
      
      // 페이지 번호 업데이트 (데이터 처리 이후에 업데이트)
      setPageNumber(newPageNumber);
      console.log("pageNumber: ", pageNumber)
      setCategoryId(newCategoryId);
      
      // 데이터 요청 완료 후 isFetching 상태를 false로 설정
      setIsFetching(false);
    } catch (error) {
    console.error('Error fetching data:', error);
    }
    
  };

  const handleLoadMore = () => {
    if (!isLastPage && !isFetching) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleCategoryChange = (newCategoryId) => {
    const newQueryParams = {
      categoryId: newCategoryId,
      page: 0, // 페이지 번호 초기화
    };
    setCategoryId(newCategoryId);
    setIsLastPage(false);
    setPageNumber(0); // 페이지 번호 초기화
    setData([]); // 기존 데이터 초기화
    fetchData(newQueryParams); // 새로운 카테고리로 데이터 불러오기
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
  
  // const handleScroll = () => {
  //   if (
  //     window.innerHeight + window.scrollY >=
  //     document.body.offsetHeight - 100
  //   ) {
  //     handleLoadMore();
  //   }
  // };

  // 스크롤 이벤트 핸들러를 debounce로 감싸서 딜레이를 적용
  const handleScroll = debounce(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      handleLoadMore();
    }
  }, 300); // 300 밀리초의 딜레이 적용 (원하는 값을 설정하세요)

  // useEffect에 스크롤 이벤트 핸들러 등록
  useEffect(() => {
    fetchData();
    data.forEach(item => fetchAndRoles(item.andId));
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageNumber, categoryId, andStatus, sortField, sortOrder]);


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
          placeholder="검색어 입력"
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
              <div>
                <Typography id='and-title'>{item.andTitle}</Typography>
                <Typography id='user-id'>@{item.userId}</Typography>
              </div>
              <div>
                <Typography id='and-end-date'>
                  {calculateRemainingDays(item.andEndDate)}
                </Typography>
              </div>
              <div id='showmore-button-box'>
              <button id='follow'>팔로우</button>
              <img id='show-more-img' src={showMoreImg} alt="showMoreImg" aria-controls="simple-menu" aria-haspopup="true" 
                onClick={handleClick1} />
              </div>
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
