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
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {  Grid } from "@mui/material";
import { GetUserId } from "../components/user/GetUserId";
import { AiOutlineHeart  ,AiFillHeart} from "react-icons/ai";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

const MyPaginate = styled(ReactPaginate).attrs({
  activeClassName: "active",
})`
  margin: 50px 16px;
  display: flex;
  justify-content: center;
  list-style-type: none;
  padding: 0 5rem;
  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    cursor: pointer;
  }
  li.previous a,
  li.next a {
    color: #63b762;
  }
  li.active a {
    color: #91cd96;
    font-weight: 700;
    min-width: 32px;
  }
  li.disabled a {
    color: #a6a6a6;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;


const CrowdList = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [sortField, setSortField] = useState('publishedAt');
  const [crowdStatus, setCrowdStatus] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  
  const [isClicked, setIsClicked] = useState(false);
  const [rolesData, setRolesData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [popularCrowd, setPopularCrowd] = useState([]);
  const [isLiked, setIsLiked] = useState(null);
  const now = new Date();

  // CrowdMainImg에서 사용할 이미지 배열
  const [carouselImages, setCarouselImages] = useState([
    { imageColor: "yellow", imageUrl: "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=700&h=400" },
    { imageColor: "green", imageUrl: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=700&h=400" },
  ]);
  
  const fetchPopularCrowd = async () => {
    try{
      const response = await fetch('/crowd/popular/top5');
      const jsonData = await response.json();
      console.log("fetchPopularCrowd: ", jsonData);
      setPopularCrowd(jsonData);
    } catch (error) {
      console.error('Error fetching popular crowd:', error);
    }
  };

  useEffect(() => {
    fetchPopularCrowd();
  }, [])

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryId(category.name); // 카테고리 ID 업데이트
    setPageNumber(0); // 페이지 번호 초기화
    setData([]); // 데이터 초기화
    fetchCrowdList(); // 크라우드 목록 다시 불러오기
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
    fetchCrowdList();
  }, [pageNumber, categoryId, crowdStatus, sortField]);

  const fetchCrowdList = async () => {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber,
        crowdCategoryId: categoryId,
        crowdStatus: crowdStatus,
        sortField: sortField,
        searchKeyword: searchKeyword,
      });

      console.log(`/crowd/page?${params.toString()}`);
      const response = await fetch(`/crowd/page?${params.toString()}`);
      const jsonData = await response.json();

      console.log("jsonData: ", jsonData);
      console.log("totalPages: ", jsonData.totalPages);
      // 전체 페이지 수
      setPageCount(jsonData.totalPages);

      setData(jsonData.content);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigateToDetail = (crowdId) => {
    navigate(`/crowd/${crowdId}`);
  }; // 펀딩글 클릭시 상세페이지 이동  

  const handleSortFieldChange = (newSortField) => {
    setSortField(newSortField); // 정렬 기준 업데이트
    setPageNumber(0); // 페이지 번호 초기화
    setData([]); // 데이터 초기화
    fetchCrowdList(); // 크라우드 목록 다시 불러오기
  };
  
  // 선택한 카테고리에 따라 게시글 필터링
  const filteredCrowdData = selectedCategory
  ? data.filter((crowd) => crowd.crowdCategoryName === selectedCategory)
  : data;

  const handleCategorySelect = (crowdCategoryId) => { // 
    setCategoryId(crowdCategoryId)
  }

  function calculateRemainingDays(crowdEndDate) { // 남은일수 표시
    const now = new Date();
    const end = new Date(crowdEndDate);
    const diffInMs = end - now;
    
    const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000));

    return diffInDays >= 0 ? diffInDays : '일 남음';
  }

  const navigateToCreate = () => {
    navigate("/crowd/create1");
  };

  const formatMoney = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }; // 모집금액 단위 표시  
  
  const handleSortStatusChange = (event) => {
    const { name, value } = event.target;
    setCrowdStatus(Number(value));
    setPageNumber(0);
    setData([]);
  };

  const fetchIsLiked = async (crowdId) => {
    try {
      const userId = GetUserId();
      const response = await fetch(`/crowd/${crowdId}/like/${userId}`);  
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

  const fetchLike = async (crowdId) => {
    const userId = GetUserId();
    console.log(`/crowd/${crowdId}/like/${userId}`);
    try {
      const response = await fetch(`/crowd/${crowdId}/like/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const newIsLiked = await fetchIsLiked(crowdId); // fetchIsLiked 함수를 호출하여 새로운 isLiked 값을 가져옴
        if (newIsLiked !== null) {
          // 가져온 새로운 isLiked 값을 사용하여 해당 게시물의 좋아요 상태를 업데이트
          setIsLiked(prevIsLiked => ({
            ...prevIsLiked,
            [crowdId]: newIsLiked,
          }));

          // likeSum 값을 업데이트
          setData(prevData => prevData.map(item => {
            if (item.crowdId === crowdId) {
              // 해당 게시물의 likeSum 값을 업데이트
              return { ...item, likeSum: newIsLiked ? item.likeSum + 1 : item.likeSum - 1 };
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

  useEffect(() => {
    const fetchDataAndSetIsLiked = async () => {
      const newIsLikedData = {}; // 새로운 데이터 객체 생성
  
      for (const item of data) {
        const newData = await fetchIsLiked(item.crowdId);
        if (newData !== null) {
          newIsLikedData[item.crowdId] = newData; // 데이터 업데이트
        }
      }
  
      setIsLiked(newIsLikedData); // 데이터 한꺼번에 업데이트
    };
  
    fetchDataAndSetIsLiked(); // 데이터 가져와서 업데이트하는 함수 호출
  }, [data]);


  return (
    <div>
      <div className={styles.carousel} style={{ width: '90%', margin: '0 auto' }}>
        {/* 화면상단 인기/추천 게시글 */}
        <Box sx={{ borderRadius: 'sm', p: 2}}>
          <AspectRatio objectFit="contain" maxHeight={200}>
            <CrowdMainImg images={popularCrowd} />
          </AspectRatio>
        </Box>
      </div>{/* 카테고리 */}
        <div className={styles.btnCategory}>
          <CrowdCategoryList onCategorySelect={handleCategorySelect} />
          <button className={styles.linkToCreate} type="button" onClick={navigateToCreate}>
            프로젝트 생성
          </button>
        </div>
        <div className={styles.crowdListblock}>
          <select
            name='sortStatus'
            value={crowdStatus}
            onChange={handleSortStatusChange}
            style={{ width: "80px", marginRight: "20px" }}
          >
            <option value="1">모집중</option>
            <option value="2">반려</option>
            <option value="3">종료</option>
            <option value="4">작성중</option>
            <option value="0">심사중</option>
          </select>
          {/* 상태별분류 목록 */}
          <div
            className={`sortOption ${sortField === 'publishedAt' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('publishedAt')}
            style={{ cursor: 'pointer', marginRight: '20px' }}
          >
            최신순
          </div>
          <div
            className={`sortOption ${sortField === 'viewCount' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('viewCount')}
            style={{ cursor: 'pointer', marginRight: '20px' }}
          >
            인기순
          </div>
          <div
            className={`sortOption ${sortField === 'crowdEndDate' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('crowdEndDate')}
            style={{ cursor: 'pointer', marginRight: '20px' }}
          >
            마감임박순
          </div>
          <div
            className={`sortOption ${sortField === 'likeSum' ? 'selected' : ''}`}
            onClick={() => handleSortFieldChange('likeSum')}
            style={{ cursor: 'pointer', marginRight: '5%' }}
          >
            좋아요순
          </div>
        </div>
        <br />
        {/* <div className={styles.listContainer} style={{ gap: '20px', marginLeft: '20px' }}> */}
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 6 }} marginBottom={4} paddingLeft={4} paddingRight={4} >
            {filteredCrowdData && filteredCrowdData.map((crowd) => (
              <Grid item md={4} sm={12} xs={12}>
              <Card
                key={crowd.crowdId}
                sx={{ boxShadow: 'lg', cursor: 'none'}}
              >
                <CardOverflow style={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden', cursor: 'none' }}>
                  <AspectRatio sx={{ minWidth: 200 }}>
                    <img
                      src={crowd.headerImg}  
                      srcSet={`${crowd.headerImg}?auto=format&fit=crop&w=286&dpr=2 2x`}
                      loading="lazy"
                      alt=""
                      style={{ width: '100%', height: 'auto', cursor: 'none' }}
                    />
                    <div className={styles.hearButton}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '7px',
                        padding: '5px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        zIndex: 9, 
                      }}
                      onClick={() => fetchLike(crowd.crowdId)}
                    >
                      {isLiked[crowd.crowdId] ? (
                        <div className={styles.heartBox}>
                        <FavoriteRoundedIcon className={styles.heartIcon} sx={{ fontSize: 27 }} />
                        <p className={styles.crowdLikeSum}>{crowd.likeSum}</p>
                        </div>
                      ) : (
                        <div className={styles.heartBox}>
                        <FavoriteBorderRoundedIcon className={styles.heartIcon} sx={{ fontSize: 27 }} />
                        <p className={styles.crowdLikeSum}>{crowd.likeSum}</p>
                        </div>
                      )}
                    </div>
                  </AspectRatio>
                </CardOverflow>
                <CardContent>
                  <Typography level="body-xs" onClick={() => navigateToDetail(crowd.crowdId)} >{crowd.crowdCategory}</Typography>
                  <Link
                    fontWeight="lg"
                    color="neutral"
                    textColor="text.primary"
                    overlay
                    sx={{overflow:'hidden', fontSize: 20, textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block'}}
                    to={`/crowd/${crowd.crowdId}`} 
                  >
                    {crowd.crowdTitle}
                  </Link>
                  <Typography
                    level="title-lg"
                    sx={{ mt: 1, fontWeight: 'xl' }}
                    endDecorator={
                      <Chip component="span" size="sm" variant="soft" color="success">
                        <b>{getDaysBetweenDate(now, crowd.crowdEndDate)+1} 일 남음 </b> 
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
              </Grid>
            ))}
            </Grid>
          {/* </div> */}

        <MyPaginate
        pageCount={pageCount}
        onPageChange={({ selected }) => setPageNumber(selected)}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousLabel="< "
        nextLabel=" >"  
        pageRangeDisplayed={5}
        marginPagesDisplayed={0}
        breakLabel="..."
        renderOnZeroPageCount={null}
      />
    </div>
  )
};

export default CrowdList;
