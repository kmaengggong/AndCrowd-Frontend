import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/crowd/CrowdList.module.css";
import Box from '@mui/joy/Box';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import axios from 'axios';

const CrowdList = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 4; // 페이지당 데이터 수
  const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
  const [categoryId, setCategoryId] = useState(0);
  const [sortField, setSortField] = useState('publishedAt');
  const [crowdStatus, setCrowdStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();
  
  const [isClicked, setIsClicked] = useState(false);
  const [rolesData, setRolesData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleCategoryClick = (category) => { // 카테고리 선택 시 호출되는 함수
    setSelectedCategory(category);
  };

  const fetchCrowdRoles = async (id) => { // 크라우드 글 선택시 상세페이지로 넘어가주는 구문
    try {
      const response = await fetch(`/crowd/list/${id}`);
      const jsonData = await response.json();
      console.log(jsonData);
      setRolesData(prevState => ({ ...prevState, [id]: jsonData }));
    } catch (error) {
      console.error('Error fetching and roles:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => { // 리스트 화면에 조회될 크라우드 목록들
      try {
        const response = await axios.get('/crowd/list'); // API 엔드포인트 호출
        const jsonData = response.data;
        setData(jsonData);
        // 데이터를 가져온 후에만 fetchCrowdRoles 함수 호출
        if (jsonData && jsonData.length > 0) {
          jsonData.forEach(item => fetchCrowdRoles(item.crowdId));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [pageNumber, categoryId, crowdStatus, sortField, sortOrder]);

  // useEffect(() => {
  //   fetchData();
  //   data.forEach(item => fetchCrowdRoles(item.crowdId));
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [pageNumber, categoryId, crowdStatus, sortField, sortOrder]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: pageNumber,
        size: pageSize,
        crowdCategoryId: categoryId,
        crowdStatus: crowdStatus,
        sortField: sortField,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/crowd/list?${params.toString()}`);
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

  const navigateToDetail = (crowdId) => {
    navigate(`/crowd/detail/${crowdId}`);
  }; // 펀딩글 클릭시 상세페이지 이동  

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
    setIsLastPage(false);
    setPageNumber(0); // 페이지 번호 초기화
    setData([]); // 기존 데이터 초기화
    fetchData(); // 새로운 정렬 기준으로 데이터 불러오기
  };

  const handleSortFieldChange = async (newSortField) => {
    setSortField(newSortField);
    setPageNumber(0);
    setData([]);
    fetchData();

    try {
      const params = new URLSearchParams({
        page: 0, // 페이지 번호를 0으로 초기화
        size: pageSize,
        crowdCategoryId: categoryId,
        crowdStatus: crowdStatus,
        sortField: newSortField, // 새로운 정렬 기준으로 설정
        sortOrder: sortOrder,
      });
      const response = await fetch(`/crowd/list?${params.toString()}`);
      const jsonData = await response.json();
  
      console.log('jsonData:', jsonData);
  
      // 새로운 데이터로 화면 업데이트
      setData(jsonData.content);
      setIsLastPage(jsonData.last);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setPageNumber(0);
    setData([]); 
    fetchData(); 
  };
  
  const handleScroll = () => {
    if (
      window.innerWidth + window.scrollX >=
      document.body.offsetWidth - 100
    ) {
      handleLoadMore();
    }
  };
  
  // 선택한 카테고리에 따라 게시글 필터링
  const filteredCrowdData = selectedCategory
    ? data.filter((crowd) => crowd.category === selectedCategory)
    : data;

  function calculateRemainingDays(crowdEndDate) { // 남은일수 표시
    const now = new Date();
    const end = new Date(crowdEndDate);
    const diffInMs = end - now;
    
    const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000));

    return diffInDays >= 0 ? diffInDays : '일 남음';
  }

  const navigateToCreate = () => {
    navigate("/crowd/create");
  };
  
  return (
    <div>
      <button className={styles.linkToCreate} type="button" onClick={navigateToCreate}>
        프로젝트 시작하기
      </button>
      <br />
      <div className={styles.carousel}>
        {/* 화면상단 인기/추천 게시글 */}
        <Box sx={{ borderRadius: 'sm', p: 1}}>
          <AspectRatio objectFit="contain" maxHeight={500}>
            <img
              id="carouselImg"
              src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
              srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
              alt="landscape"
            />
          </AspectRatio>
        </Box>
      </div>
      <div className={styles.btnCategory}>{/* 카테고리 */}
          <button onClick={() => handleCategoryClick('카테고리 1')}>카테고리 1</button>
          <button onClick={() => handleCategoryClick('카테고리 2')}>카테고리 2</button>
          <button onClick={() => handleCategoryClick('카테고리 3')}>카테고리 3</button>
          <button onClick={() => handleCategoryClick('카테고리 4')}>카테고리 4</button>
          <button onClick={() => handleCategoryClick('카테고리 5')}>카테고리 5</button>
          <button onClick={() => handleCategoryClick('카테고리 6')}>카테고리 6</button>
      </div>
      <div className={styles.crowdListblock}>
        {/* 상태별분류 목록 */}
        <div>
          <Typography
            className={`sortOption ${sortField === 'publishedAt' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('publishedAt')}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            최신순
          </Typography>
        </div>
        <div>
          <Typography
            className={`sortOption ${sortField === 'crowdViewCount' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdViewCount')}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            인기순
          </Typography>
        </div>
        <div>
          <Typography
            className={`sortOption ${sortField === 'crowdEndDate' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdEndDate')}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            마감임박순
          </Typography>
        </div>
        <div>
          <Typography
            className={`sortOption ${sortField === 'crowdLikeSum' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdLikeSum')}
            style={{ cursor: 'pointer' }}
          >
            좋아요순
          </Typography>
        </div>
      </div>
      <br />
        <div className={styles.listContainer}>
          {/* 데이터를 매핑하여 화면에 게시물 목록을 표시하는 코드 */}
          {filteredCrowdData && filteredCrowdData.map((crowd) => (
            <div key={crowd.crowdId} onClick={() => navigateToDetail(crowd.crowdId)}>
              <h2>{crowd.crowdTitle}</h2>
              <p>{crowd.crowdCategory}</p>
              {/* 다른 게시글 내용 표시 요소 추가 */}
            </div>
          ))}
        </div>
        <br />
      </div>
  )
};

export default CrowdList;