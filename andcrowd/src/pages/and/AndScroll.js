import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

const AndScroll = () => {
  const [andList, setAndList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const { categoryId, andStatus, sortField, sortOrder } = useParams();
  const size = 2; // 페이지 크기 설정

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!hasMore || loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/and/scroll/${categoryId}/${andStatus}/${sortField}/${sortOrder}?size=${size}&page=${pageNumber}`);
      
      if (response.ok) {
        const data = await response.json();

        console.log("Fetched data:", data); // 데이터 확인을 위한 로그

        if (data.content.length > 0) {
          setAndList((prevList) => [...prevList, ...data.content]);
          setPageNumber((prevPageNumber) => prevPageNumber + 1); // 페이지 번호 증가
          console.log("Updated pageNumber:", pageNumber); // pageNumber 대신 prevPageNumber 사용
          console.log("Updated andList:", andList);
        } else {
          setHasMore(false);
        }
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching And data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const threshold = 100; // 필요에 따라 이 값을 조정하세요

    if (!loading && hasMore && document.documentElement.scrollHeight - (window.innerHeight + window.scrollY) < threshold) {
      fetchData();
    }    
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);



  return (
<div>
      <h1>And Feed</h1>
      <div className="feed-container">
        {andList.map((and) => (
          <div key={and.andId} className="feed-card">
            <div className="feed-card-header">
              <h2><Link to={`/and/${and.andId}`}>{and.andTitle}</Link></h2>
            </div>
            <div className="feed-card-content">
              <p>{and.andContent}</p>
            </div>
            <div className="feed-card-footer">
              <span>Published: {and.publishedAt}</span>
              <span>Updated: {and.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && !hasMore && <p>No more data to load.</p>}
      <Link to="/and/create">Create New Post</Link>
    </div>
  );
};

export default AndScroll;
