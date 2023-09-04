import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import styles from "../styles/crowd/CrowdList.module.css";
import Box from '@mui/joy/Box';
import { Button } from '@mui/material';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import CrowdMainImg from "./crowd/CrowdMainImg";

const CrowdList = () => {
  
  return (
    <div>
      <button className={styles.linkToCreate}>
        <Link href="http://localhost:3000/crowd/create">펀딩을 시작해보세요!</Link>
      </button>
      <br />
      {/* <CrowdMainImg /> */}
      <div className={styles.carousel}>
        {/* 화면상단 인기/추천 게시글 */}
        <Box sx={{ borderRadius: 'sm', p: 1}}>
          <AspectRatio objectFit="contain" maxHeight={550}>
          <img
            src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
            srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
            alt="A beautiful landscape."
          />
          </AspectRatio>
        </Box>
        {/* <AspectRatio>
          <Typography level="h2" component="div">
            16/9
          </Typography>
        </AspectRatio> */}
      </div>
      <div className={styles.btnCategory}>{/* 카테고리 */}
        <Button variant="solid" href="#">Category</Button>
        <Button variant="solid" href="#">Category</Button>
        <Button variant="solid" href="#">Category</Button>
        <Button variant="solid" href="#">Category</Button>
        <Button variant="solid" href="#">Category</Button>
        <Button variant="solid" href="#">Category</Button>
      </div>
      <div className={styles.crowdListblock}>
        <Box>
          <Button variant="plain" href="http://localhost:3000/crowd/list">전체</Button>
          <Button variant="plain" href="#">추천</Button>
          <Button variant="plain" href="#">인기</Button>
          <Button variant="plain" href="#">모집금액</Button>
          <Button variant="plain" href="#">마감임박</Button>
          <Button variant="plain" href="#">응원참여자</Button>
        </Box>
      </div>
      <br />
      <div className={styles.cardList}> {/* findAll 기능사용해서 전체리스트 불러오기 기능 */}
        <Card sx={{ width: 320, maxWidth: '100%', boxShadow: 'lg' }}>
        <CardOverflow>
          <AspectRatio sx={{ minWidth: 200 }}>
            <img
              src="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286"
              srcSet="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography level="body-xs">Bluetooth Headset</Typography>
          <Link
            href="#product-card"
            fontWeight="md"
            color="neutral"
            textColor="text.primary"
            overlay
            endDecorator={<ArrowOutwardIcon />}
            to="/crowd/detail/${crowd.crowdId}"
          >
            {/* CrowdTitle */}
            노이즈 캔슬링의 최강자 A400!
          </Link>
          <Typography
            level="title-lg"
            sx={{ mt: 1, fontWeight: 'xl' }}
            endDecorator={
              <Chip component="span" size="sm" variant="soft" color="success">
                {/* (마감일자 - 현재일자)자료 불러오기 */}
                <b>10</b> 일 남음
              </Chip>
            }
          >
            {/* (목표금액 - 모은금액) 자료 불러오기 */}
            1,000,000원 달성!
          </Typography>
        </CardContent>
        {/* <CardOverflow>
          <Button variant="solid" color="danger" size="lg">
            Add to cart
          </Button>
        </CardOverflow> */}
        </Card>
      </div>
    </div>
  )
};

export default CrowdList;