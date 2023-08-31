import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/crowd/CrowdList.module.css";

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
    // 인기/추천 게시글 이미지, 로고(화살표<>), 
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
      <div className={styles.PopularRecommend}>
        인기.추천 게시글
        {/* 인기/추천 게시글 케러셀 컴포넌트 */}
        {/* popularPosts와 recommendedPosts 데이터를 활용하여 케러셀 구성 */}
      </div>
      <div>
        <tr className={styles.category}>
          <td>
            카테고리1
            {/* 펀딩 카테고리(테크.가전, 취미, IT, 후원, 모임) */}
          </td>
          <td>
            카테고리2
            {/* 펀딩 카테고리(테크.가전, 취미, IT, 후원, 모임) */}
          </td>
          <td>
            카테고리3
            {/* 펀딩 카테고리(테크.가전, 취미, IT, 후원, 모임) */}
          </td>
          <td>
            카테고리4
            {/* 펀딩 카테고리(테크.가전, 취미, IT, 후원, 모임) */}
          </td>
        </tr>
        <br />
        <div>
          <tr className={styles.crowdListblock}>
            {/* 펀딩 분류 리스트(전체, 추천, 인기, 모집금액, 마감임박, 응원참여자) */}
            {crowdlist.map(c => (
              <td className={`${styles.crowdlist} ${crowdlist === c.name && styles.active}`}
                key={c.name}
                onClick={() => {
                  setCategory(c.name); // 선택한 카테고리 업데이트
                  onSelect(c.name); // 필요한 경우 onSelect 콜백 호출
                }}>
                {c.text}
              </td>
            ))}
          </tr>
        </div>
        <br />
        <div>
          {/* 펀딩 글 리스트 */}
          {crowdList.map((crowd) => (
            <div key={crowd.crowdId.findAll()} className="crowd-card">
              {/* 펀딩 글 카드 컴포넌트 */}
              {/* crowd 객체 데이터를 활용하여 카드 구성 */}
              <Link to={`/crowd/detail/${crowd.crowdId}`}>더 보기</Link>
            </div>
          ))}
        </div>
      </div>
      <br />
      <div className={styles.cardContainer}>
        <div class={styles.card}>
          <div class={styles.cardImgTop} />
          <div class={styles.cardBody}>
            <p class={styles.cardText}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div class={styles.card}>
          <div class={styles.cardImgTop} />
          <div class={styles.cardBody}>
            <p class={styles.cardText}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div class={styles.card}>
          <div class={styles.cardImgTop} />
          <div class={styles.cardBody}>
            <p class={styles.cardText}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div class={styles.card}>
          <div class={styles.cardImgTop} />
          <div class={styles.cardBody}>
            <p class={styles.cardText}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div class={styles.card}>
          <div class={styles.cardImgTop} />
          <div class={styles.cardBody}>
            <p class={styles.cardText}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div class={styles.card}>
          <div class={styles.cardImgTop} />
          <div class={styles.cardBody}>
            <p class={styles.cardText}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CrowdList;
