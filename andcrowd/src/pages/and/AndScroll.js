import React, { useState, useEffect } from 'react';

const AndScroll = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 2; // 페이지당 데이터 수
  const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
  const [categoryId, setCategoryId] = useState(0);
  const [sortField, setSortField] = useState('');
  const [andStatus, setAndStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    fetchData();
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

  return (
    <div>
      <div>
        <label>카테고리: </label>
        <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="1">1번</option>
          <option value="2">2번</option>
          <option value="3">3번</option>
          <option value="4">4번</option>
          <option value="5">5번</option>
        </select>
      </div>

      <div>
        <label>정렬 방식: </label>
        <select value={sortOrder} onChange={(e) => handleSortOrderChange(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>

      <div>
        <label>정렬 기준: </label>
        <select value={sortField} onChange={(e) => handleSortFieldChange(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="publishedAt">게시일</option>
          <option value="andEndDate">종료일</option>
          <option value="andLikeCount">좋아요 수</option>
          <option value="andViewCount">조회수</option>
        </select>
      </div>

      {data ? (
        data.map(item => (
          <div key={item.andId}>
            <hr />
            <br/>
            <br/>
            <li>글번호: {item.andId}</li>
            <br/>
            <li>제목: {item.andTitle}</li>
            <br/>
            <li>카테고리: {item.andCategoryId}</li>
            <br/>
            <li>작성일: {item.publishedAt}</li>
            <br/>
            <li>마감일: {item.andEndDate}</li>
            <br/>
            <li>좋아요수: {item.andLikeCount}</li>
            <br/>
            <li>조회수: {item.andViewCount}</li>
            <br/>
            <li>필요인원: {item.needNumMem}</li>
            <br/>
            <br/>
            <hr />
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
