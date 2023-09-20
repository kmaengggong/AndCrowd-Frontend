import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { Button, Grid, Box } from "@mui/material";
import AndSearchCard from '../../components/and/AndSearchCard';
import '../../styles/etc/Search.css';

const Search = () => {
    const navigate = useNavigate();
    const params = useParams();
    const searchKeyword = params.searchKeyword;

    const [andList, setAndList] = useState([]);
    const [crowdList, setCrowdList] = useState([]);
    const [andPageNumber, setAndPageNumber] = useState(0); // 현재 모임 페이지 번호
    const [crowdPageNumber, setCrowdPageNumber] = useState(0); // 현재 크라우드 페이지 번호
    const pageSize = 6; // 페이지당 데이터 수
    const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
    const [categoryId, setCategoryId] = useState(0);
    const [sortField, setSortField] = useState('publishedAt');
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 여부 상태
    const [andCount, setAndCount] = useState(''); // 모임 게시물 수
    const [crowdCount, setCrowdCount] = useState(''); // 크라우드 게시물 수 
    const [pageCount, setPageCount] = useState(0); // 크라우드 전체 페이지 수 

    useEffect(() => {
      setAndPageNumber(0);
      setCrowdPageNumber(0);
      fetchAndData();
      fetchAndSize();
      fetchCrowdData();
    }, [searchKeyword]);

    const fetchAndData = async () => {
      console.log("andPageNumber: ", andPageNumber)
        try {
          const params = new URLSearchParams({
            page: 0,
            size: pageSize,
            andCategoryId: categoryId,
            andStatus: 13,
            sortField: sortField,
            sortOrder: "desc",
            searchKeyword: searchKeyword,
          });
    
          const response = await fetch(`/and/scroll?${params.toString()}`);
    
          const jsonData = await response.json();
        
          
          // 검색 기준이 변경되었을 때, 기존 데이터 초기화
          if (andPageNumber === 0) {
            setAndList(jsonData.content);
            setIsLastPage(jsonData.last);
          } else {
            setAndList(prevData => [...prevData, ...jsonData.content]);
          }
        } catch (error) {
        console.error('Error fetching data:', error);
        }
        
    };

    const fetchAndSize = async () => {
        const response = await fetch(`/and/total/${searchKeyword}`);
        const data = await response.json();
        setAndCount(data);
    }
    
    const handleLoadMore = () => {
        if (isLastPage || isLoading) {
          return; // 이미 마지막 페이지에 도달하거나 데이터를 로딩 중이면 작업을 중지
        }
      
        // 다음 페이지 번호를 증가시키고 데이터를 로드
        const nextPage = andPageNumber + 1;
        setAndPageNumber(nextPage);
        setIsLoading(true);
      
        const params = new URLSearchParams({
          page: nextPage,
          size: pageSize,
          andCategoryId: categoryId,
          andStatus: 13,
          sortField: sortField,
          sortOrder: "desc",
          searchKeyword: searchKeyword,
        });
      
        fetch(`/and/scroll?${params.toString()}`)
          .then((response) => response.json())
          .then((jsonData) => {
            // 다음 페이지 데이터를 현재 데이터에 추가
            setAndList((prevData) => [...prevData, ...jsonData.content]);
            setIsLastPage(jsonData.last);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });
    };
      
    const fetchCrowdData = async () => {
      console.log("crowdPageNumber: ", crowdPageNumber)
      try {
        const params = new URLSearchParams({
          pageNumber: 0,
          crowdCategoryId: categoryId,
          crowdStatus: 13,
          crowdStatus: '',
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
        
        // 결과 개수
        setCrowdCount(jsonData.totalElements);

        setCrowdList(jsonData.content);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const handleLoadCrowdMore = () => {
      console.log(crowdPageNumber === (pageCount-1))
      if (crowdPageNumber === (pageCount-1) || isLoading) {
        return; // 이미 마지막 페이지에 도달하거나 데이터를 로딩 중이면 작업을 중지
      }
    
      // 다음 페이지 번호를 증가시키고 데이터를 로드
      const nextPage = crowdPageNumber + 1;
      setCrowdPageNumber(nextPage);
      setIsLoading(true);

      const params = new URLSearchParams({
        pageNumber: nextPage,
        crowdCategoryId: categoryId,
        crowdStatus: 13,
        crowdStatus: '',
        sortField: sortField,
        searchKeyword: searchKeyword,
      });
    
      fetch(`/crowd/page?${params.toString()}`)
        .then((response) => response.json())
        .then((jsonData) => {
          // 다음 페이지 데이터를 현재 데이터에 추가
          setCrowdList((prevData) => [...prevData, ...jsonData.content]);
          setCrowdPageNumber(nextPage);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
  };


    return(
        <div className='container'>
            <div className='title'>
                <h1>총 {andCount + crowdCount} 건의 검색 결과를 찾았습니다.</h1>
            </div>
            <div className='andCrowd'>
                <h2>모임 ({andCount})</h2>

                <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 7 }} marginBottom={4}>
                    {andList.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                        </Grid>
                        :
                        <>
                            {andList.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <AndSearchCard project={project} type={"and"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>
                <Box textAlign='center'>
                {!isLastPage && (
                    <Button onClick={handleLoadMore} variant="outlined" color='success' sx={{ pt: 1, pb: 1, pl:3, pr:3  }}>
                        &nbsp; &nbsp; &nbsp; &nbsp; 검색 결과 더보기 &nbsp; &nbsp; &nbsp; &nbsp;
                    </Button>
                )}
                </Box>
            </div>
            <hr />
            <div className='andCrowd'>
                <h2>크라우드 ({crowdCount})</h2>

                <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 7 }} marginBottom={4}>
                    {crowdList.length === 0 ?
                        <Grid item md={4} sm={12} xs={12}>
                        </Grid>
                        :
                        <>
                            {crowdList.map((project) => (
                                <Grid item md={4} sm={12} xs={12}>
                                    <AndSearchCard project={project} type={"crowd"} />
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>
                <Box textAlign='center'>
                {(pageCount-1) > crowdPageNumber && (
                    <Button onClick={handleLoadCrowdMore} variant="outlined" color='success' sx={{ pt: 1, pb: 1, pl:3, pr:3  }}>
                        &nbsp; &nbsp; &nbsp; &nbsp; 검색 결과 더보기 &nbsp; &nbsp; &nbsp; &nbsp;
                    </Button>
                )}
                </Box>
            </div>
        </div>
    );
}

export default Search;