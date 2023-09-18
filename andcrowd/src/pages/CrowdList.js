import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/crowd/CrowdList.module.css";
import Box from '@mui/joy/Box';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { calculateRaisedAmount, getDaysBetweenDate } from '../pages/etc/Finance';
import CrowdCategoryList from "./crowd/CrowdCategoryList";
import CrowdMainImg from "./crowd/CrowdMainImg";

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

  // CrowdMainImg에서 사용할 이미지 배열
  const [carouselImages, setCarouselImages] = useState([
    { imageColor: "blue", imageUrl: "https://images.pexels.com/photos/5076531/pexels-photo-5076531.jpeg?auto=compress&cs=tinysrgb&w=600&h=400" },
    { imageColor: "yellow", imageUrl: "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=700&h=400" },
    { imageColor: "green", imageUrl: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=700&h=400" },
  ]);
  

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleCategoryClick = (category) => { // 카테고리 선택 시 호출되는 함수
    setSelectedCategory(category);
    setIsLastPage(false);
    setPageNumber(0);
    setData([]);
    fetchCrowdList();
  };

  const fetchCrowdRoles = async (id) => { // 크라우드 글 선택시 정렬 구문
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

  const fetchCrowdList = async () => {
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

      // 내림차순으로 데이터 정렬
      const sortedData = jsonData.content.sort((a, b) => {
        const dateA = new Date(a.crowdEndDate);
        const dateB = new Date(b.crowdEndDate);
        return dateB - dateA;
      });

      // 다음 페이지가 있는지 여부를 업데이트
      setIsLastPage(jsonData.last);

      // 검색 기준이 변경되었을 때, 기존 데이터 초기화
      if (pageNumber === 0) {
        setData(sortedData);
      } else {
        setData(prevData => [...prevData, ...sortedData]);
      }
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
    navigate(`/crowd/${crowdId}`);
  }; // 펀딩글 클릭시 상세페이지 이동  

  const handleSortFieldChange = async (newSortField) => {
    setSortField(newSortField);
    setPageNumber(0);
    setData([]);
    fetchCrowdList();

    try {
      const params = new URLSearchParams({
        page: 0, // 페이지 번호를 0으로 초기화
        size: pageSize,
        crowdCategoryName: categoryId,
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
  
  // 선택한 카테고리에 따라 게시글 필터링
  const filteredCrowdData = selectedCategory
  ? data.filter((crowd) => crowd.crowdCategoryName === selectedCategory)
  : data;

  const handleCategorySelect = (crowdCategoryName) => { // 

  }

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

  const formatMoney = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }; // 모집금액 단위 표시  
  
  return (
    <div>
      <button className={styles.linkToCreate} type="button" onClick={navigateToCreate}>
        프로젝트 시작하기
      </button>
      <br />
      <div className={styles.carousel}>
        {/* 화면상단 인기/추천 게시글 */}
        <Box sx={{ borderRadius: 'sm', p: 1}}>
          <AspectRatio objectFit="contain" maxHeight={400}>
            <CrowdMainImg images={carouselImages} />
          </AspectRatio>
        </Box>
      </div>{/* 카테고리 */}
        <div className={styles.btnCategory}>
          <CrowdCategoryList onCategorySelect={handleCategorySelect} />
        </div>
        <div className={styles.crowdListblock}>
          {/* 상태별분류 목록 */}
          <div
            className={`sortOption ${sortField === 'publishedAt' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('publishedAt')}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            최신순
          </div>
          <div
            className={`sortOption ${sortField === 'crowdViewCount' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdViewCount')}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            인기순
          </div>
          <div
            className={`sortOption ${sortField === 'crowdEndDate' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdEndDate')}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            마감임박순
          </div>
          <div
            className={`sortOption ${sortField === 'crowdLikeSum' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdLikeSum')}
            style={{ cursor: 'pointer' }}
          >
            좋아요순
          </div>
        </div>
        <br />
        <div className={styles.listContainer} style={{ gap: '20px', marginLeft: '20px' }}>
            {filteredCrowdData && filteredCrowdData.map((crowd) => (
              <Card
                key={crowd.crowdId}
                sx={{ width: '250px', maxWidth: '100%', boxShadow: 'lg', cursor: 'pointer' }}
                onClick={() => navigateToDetail(crowd.crowdId)}
              >
                <CardOverflow>
                  <AspectRatio sx={{ minWidth: 200 }}>
                    <img
                      src={crowd.headerImg}  
                      srcSet={`${crowd.headerImg}?auto=format&fit=crop&w=286&dpr=2 2x`}
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                </CardOverflow>
                <CardContent>
                  <Typography level="body-xs">{crowd.crowdCategory}</Typography>
                  <Link
                    fontWeight="md"
                    color="neutral"
                    textColor="text.primary"
                    overlay
                    endDecorator={<ArrowOutwardIcon />}
                    to={`/crowd/${crowd.crowdId}`} 
                  >
                    {crowd.crowdTitle}
                  </Link>
                  <Typography
                    level="title-lg"
                    sx={{ mt: 1, fontWeight: 'xl' }}
                    endDecorator={
                      <Chip component="span" size="sm" variant="soft" color="success">
                        <b>{getDaysBetweenDate(crowd.publishedAt, crowd.crowdEndDate)} 일 남음 </b> 
                      </Chip>
                    }
                  >
                    {formatMoney(calculateRaisedAmount(crowd.crowdGoal, crowd.currentAmount))}원 달성!  
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: 'gray', fontStyle: 'italic'}}>
                    모금액: {formatMoney(crowd.crowdGoal)} 원 
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        <br />
    </div>
  )
};

export default CrowdList;