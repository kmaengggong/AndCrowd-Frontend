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
    const [pageNumber, setPageNumber] = useState(0);
    const pageSize = 6; // 페이지당 데이터 수
    const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
    const [categoryId, setCategoryId] = useState(0);
    const [sortField, setSortField] = useState('publishedAt');
    const [andStatus, setAndStatus] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [andCrowd, setAndCrowd] = useState('');
    const [page, setPage] = useState(0); // 현재 페이지 번호 상태
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 여부 상태
    const [andCount, setAndCount] = useState('');

    const fetchAndData = async () => {
        try {
          const params = new URLSearchParams({
            page: pageNumber,
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
          if (pageNumber === 0) {
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
    
      useEffect(() => {
        fetchAndData();
        fetchAndSize();
    }, [searchKeyword]);

    const handleLoadMore = () => {
        if (isLastPage || isLoading) {
          return; // 이미 마지막 페이지에 도달하거나 데이터를 로딩 중이면 작업을 중지
        }
      
        // 다음 페이지 번호를 증가시키고 데이터를 로드
        const nextPage = page + 1;
        setPage(nextPage);
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
      


    return(
        <div className='container'>
            <div className='title'>
                <h1>총 {andCount}(+ 펀딩) 건의 검색 결과를 찾았습니다.</h1>
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
                <h2>크라우드 ({})</h2>
            </div>
        </div>
    );
}

export default Search;