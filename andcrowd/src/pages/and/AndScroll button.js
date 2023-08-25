import React, { useState, useEffect } from 'react';

const AndScroll = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 2; // 페이지당 데이터 수
  const [isLastPage, setIsLastPage] = useState(false); // 다음 페이지가 마지막 페이지인지 여부
  const [categoryId, setCategoryId] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    fetchData();
  }, [pageNumber, categoryId, sortField, sortOrder]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: pageNumber,
        size: pageSize,
        andCategoryId: categoryId,
        sortField: sortField,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/and/scroll?${params.toString()}`);
      const jsonData = await response.json();

      console.log('jsonData:', jsonData);

      // 다음 페이지가 있는지 여부를 업데이트
      setIsLastPage(jsonData.last);

      // 검색 기준이 변경되었을 때, 기존 데이터 초기화
      if (pageNumber === 0) {
        setData(jsonData.content);
      } else {
        setData(prevData => [...prevData, ...jsonData.content]);
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

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
    setPageNumber(0);
    setData([]); // 기존 데이터 초기화
  };

  const handleSortFieldChange = (newSortField) => {
    setSortField(newSortField);
    setPageNumber(0);
    setData([]); // 기존 데이터 초기화
  };

  return (
    <div>
      {/* 카테고리 입력 */}
      <div>
        <label>카테고리: </label>
        <input
          type="number"
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
        />
      </div>

      {/* 정렬 기준 입력 */}
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

      {/* 정렬 방식 입력 */}
      <div>
        <label>정렬 방식: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>

      {/* 데이터를 렌더링하는 부분 */}
      {data ? (
        data.map(item => (
          <div key={item.andId}>
            <hr />
            <li>제목: {item.andTitle}</li>
            <li>카테고리: {item.andCategoryId}</li>
            <li>작성일: {item.publishedAt}</li>
            <li>마감일: {item.andEndDate}</li>
            <li>좋아요수: {item.andLikeCount}</li>
            <li>조회수: {item.andViewCount}</li>
            <hr />
          </div>
        ))
      ) : (
        <div>데이터가 없습니다.</div>
      )}
      
      {/* 더보기 버튼 */}
      {!isLastPage && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button onClick={handleLoadMore}>더보기</button>
        </div>
      )}

      {/* 마지막 페이지인 경우 메시지 표시 */}
      {isLastPage && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <p>마지막 페이지입니다.</p>
        </div>
      )}
    </div>
  );
};

export default AndScroll;
