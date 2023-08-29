import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/CrowdList.module.css";

const crowdlist = [ // 카테고리 -> 네이게이션으로 변경
    {
      name: 'all',
      text: '전체'
    },
    {
      name: 'recommend',
      text: '추천순',
    },
    {
      name: 'popular',
      text: '인기순'
    },
    {
      name: 'crowdGoal',
      text: '모집금액순'
    },
    {
      name: 'crowdEndDate',
      text: '마감임박순'
    },
    {
      name: 'newCrowd',
      text: '최신순'
    },
    {
      name: 'crowdApplicant',
      text: '응원참여자순'
    }
]

const CrowdList = ({ onSelect }) => {
  const [crowdList, setCrowdList] = useState([]);
  // const [popularPosts, setPopularPosts] = useState([]);
  // const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    // 인기/추천 게시글 데이터를 가져오는 함수 호출
    // const fetchPopularAndRecommendedPosts = async () => {
    //   const popularData = await fetchCrowdData("popular");
    //   setPopularPosts(popularData);

    //   const recommendedData = await fetchCrowdData("recommended");
    //   setRecommendedPosts(recommendedData);
    // };

    // fetchPopularAndRecommendedPosts();

    // 펀딩 글 목록 데이터를 가져오는 함수 호출
    const fetchCrowdData = async (category) => {
      // const crowdListData = await fetchCrowdData("all");
      // setCrowdList(crowdListData);
      const res = await fetch("/crowd/list");
      const data = await res.json();
      return data;
    };

    fetchCrowdData(category).then((data) => {
      setCrowdList(data);
    });
  }, [category]);

  return (
    <div>
      <div>
        {/* 인기/추천 게시글 케러셀 컴포넌트 */}
        {/* popularPosts와 recommendedPosts 데이터를 활용하여 케러셀 구성 */}
      </div>
      <tbody>
        <tr className={styles.crowdListblock}>
          {crowdlist.map(c => (
            <td className={`${styles.crowdlist} ${crowdlist === c.name && styles.active}`}
              key={c.name}
              onClick={() => {
                setCategory(c.name); // 선택한 카테고리 업데이트
                onSelect(c.name); // 필요한 경우 onSelect 콜백 호출
              }}
            >
              {c.text}
            </td>
          ))}
        </tr>
        <div>
          {/* 펀딩 글 리스트 */}
          {crowdList.map((crowd) => (
            <div key={crowd.crowdId} className="crowd-card">
              {/* 펀딩 글 카드 컴포넌트 */}
              {/* crowd 객체 데이터를 활용하여 카드 구성 */}
              <Link to={`/crowd/detail/${crowd.crowdId}`}>더 보기</Link>
            </div>
          ))}
        </div>
      </tbody>
    </div>
  )
};

export default CrowdList;