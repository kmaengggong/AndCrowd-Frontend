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

const CrowdList = () => {
  
  return (
    <div>
      <div className={styles.carousel}>
        <AspectRatio>
          <Typography level="h2" component="div">
            16/9
          </Typography>
        </AspectRatio>
      </div>
      <div className={styles.btnCategory}>{/* 카테고리 */}
        <Button variant="solid" color="neutral">Category</Button>
        <Button variant="solid" color="grey">Category</Button>
        <Button variant="solid" color="grey">Category</Button>
        <Button variant="solid" color="grey">Category</Button>
        <Button variant="solid" color="grey">Category</Button>
        <Button variant="solid" color="grey">Category</Button>
      </div>
      <div className={styles.crowdListblock}>
        <Box>
          <Button variant="plain">전체</Button>
          <Button variant="plain">추천</Button>
          <Button variant="plain">인기</Button>
          <Button variant="plain">모집금액</Button>
          <Button variant="plain">마감임박</Button>
          <Button variant="plain">응원참여자</Button>
        </Box>
      </div>
      <br />
      <div className={styles.cardList}>
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
          <Typography level="body-sm">
            <(<b>10</b> 일 남음)>
          </Typography>
          <Link
            href="#product-card"
            fontWeight="md"
            color="neutral"
            textColor="text.primary"
            overlay
            endDecorator={<ArrowOutwardIcon />}
          >
            Super Rockez A400
          </Link>
          <Typography
            level="title-lg"
            sx={{ mt: 1, fontWeight: 'xl' }}
            endDecorator={
              <Chip component="span" size="sm" variant="soft" color="success">
                Lowest price
              </Chip>
            }
          >
            2,900 THB
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