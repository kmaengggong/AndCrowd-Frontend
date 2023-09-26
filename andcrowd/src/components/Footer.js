import React, { useState, useEffect }from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import '../styles/Footer.css';


function Copyright() {
  return (
    <Typography id='copyright'  align="left">
      {'Copyright © '}
      <Link id='link' color="inherit" href="/">
        Andcrowd
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const { description, title } = props;
  const maxWidth = Math.min(1320, windowWidth * 0.7);

  if(window.location.pathname.startsWith("/iamtheadmin")) return null;
  
  return (
    <Box id = 'footerBox' component="footer" sx={{mt:10}}>
      <Container id='footerContainer' style={{ maxWidth: `${maxWidth}px` }}>

        <Box id='leftBox'>
        <Typography id='headText' align="left">
        &Crowd
        </Typography>
        <Typography id = 'subtitle1' align="left" >
        &Crowd는 중개업(온라인소액투자중개 및 통신판매중개)을 영위하는 플랫폼 제공자로 자금을 모집하는 당사자<br></br>
        가 아닙니다. 따라서 투자손실의 위험을 보전하거나 리워드 제공을 보장해 드리지 않으며 이에 대한 법적인 책임<br></br>
        을 지지 않습니다.
        </Typography>
        <Typography id = 'address' align="left" >
        서울시 강남구 어디로 어딘가 어느건물 111호 | 모임 02-1234-5678 | 펀딩 02-1234-5678
        </Typography>
        <Copyright />
        </Box>

        <Box id='rightBox'>
        <Typography id = 'headText2'>
        you And me make a Crowd
        </Typography>
        <Box id = 'rightFlexBox'>
          <Box id='semiRightBox'>
            <Typography id = 'footerSubtext'>
            ABOUT &Crowd
            </Typography>
            <Link id = 'footerLink' href="https://www.notion.so/kmaengggong/Crowd-ba5011d9802e4dd4ae6755f25b5e1448">
            Notion
            </Link>
            <Link id = 'footerLink' href="https://github.com/kmaengggong/AndCrowd-Frontend" >
            Github (Frontend)
            </Link>
            <Link id = 'footerLink' href="https://github.com/kmaengggong/AndCrowd-Backend">
            Github (Backend)
            </Link>
          </Box>

          <Box id='semiLeftBox'>
            <Typography id = 'footerSubtext'>
              <a href="/help">
              HELP
              </a>
            </Typography>
            <Link id = 'footerLinkInv'>
            투자위험고지 바로가기
            </Link>
            <Link id = 'footerLink'>
            회원가입 기본약관
            </Link>
            <Link id = 'footerLink'>
            &Crowd 이용약관
            </Link>
            <Link id = 'footerLink'>
            개인정보처리방침
            </Link>
          </Box>
        </Box>
        </Box>

        
      </Container>
    </Box>
  );
}

export default Footer;