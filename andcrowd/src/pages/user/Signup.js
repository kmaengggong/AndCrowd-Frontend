// 회원가입 페이지

import {React, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { SignUpEmail } from '../../components/sign/SingUpEmail';
import { SignUpAuthNumber } from '../../components/sign/SignUpAuthNumber';
import { SignUpNickname } from '../../components/sign/SignUpNickname';
import { SignUpPassword } from '../../components/sign/SignUpPassword';
import { useNavigate } from 'react-router-dom';
import { SignUpKorName } from '../../components/sign/SignUpKorName';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Signup = () => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [authNumber, setAuthNumber] = useState('');
    const [isAuthNumberValid, setIsAuthNumberValid] = useState(false);

    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);

    const [korName, setKorName] = useState('');

    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isPasswordEqual, setIsPasswordEqual] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [allowTos, setAllowTos] = useState(0);
    const [allowPrivacy, setAllowPrivacy] = useState(0);
    const [allowMarketing, setAllowMarketing] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
      if(passwordCheck.match(password)){
        setIsPasswordEqual(true);
      }
      else{
        setIsPasswordEqual(false);
      }
    }, [password, passwordCheck]);

    useEffect(() => {
      if(isPasswordEqual && password.length>0){
        setIsPasswordValid(true);
      }
    }, [isPasswordEqual, password]);

    const onChangeAllowTos = (event) => {
      event.preventDefault();
      if(event.target.checked) setAllowTos(1);
      else setAllowTos(0);
    }
    const onChangeAllowPrivacy = (event) => {
      event.preventDefault();
      if(event.target.checked) setAllowPrivacy(1);
      else setAllowPrivacy(0);
    }
    const onChangeAllowMarketing = (event) => {
      event.preventDefault();
      if(event.target.checked) setAllowMarketing(1);
      else setAllowMarketing(0);
    }

    const onFormSubmit = async (event) => {
        event.preventDefault();
        if(!isEmailValid){
          alert("이메일을 확인해 주세요.");
          return;
        }
        if(!isAuthNumberValid){
          alert("이메일 인증을 다시 해 주세요.");
          return;
        }
        if(!isNicknameValid){
          alert("닉네임을 확인해 주세요.");
          return;
        }
        if(korName === ""){
          alert("이름을 입력해주세요.")
          return;
        }
        if(!isPasswordValid){
          alert("비밀번호를 확인해 주세요.");
          return;
        }
        if(!(allowTos && allowPrivacy)){
          alert("필수 동의 약관에 동의해주세요.");
          return;
        }

        try{
          await fetch('/signup',{
            method: "POST",
            headers:{
              "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
              "userEmail": email,
              "userNickname": nickname,
              "userKorName": korName,
              "userPassword": password,
              "userTos": allowTos,
              "userPrivacy": allowPrivacy,
              "userMarketing": allowMarketing
            })
          }).then((res) => {
            console.log(res);
          })
        } catch(error){
          console.error(error);
          alert("회원가입 실패. 다시 시도해주세요.");
        }
        alert("회원가입 완료!");
        navigate("/");
    };

    return (
        
        <Container component="main" maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              ml: 5,
              mr: 5
            }}
          >
            <Typography sx={{fontSize:30, marginTop:9, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>회원가입</Typography>
            <Box component="form" noValidate onSubmit={onFormSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2} alignItems={'center'}>
                <SignUpEmail
                  email={email}
                  setEmail={setEmail}
                  setIsEmailValid={setIsEmailValid}
                  setAuthNumber={setAuthNumber}
                />
                <SignUpAuthNumber
                  authNumber={authNumber}
                  setIsAuthNumberValid={setIsAuthNumberValid}
                />
                <SignUpNickname
                  nickname={nickname}
                  setNickname={setNickname}
                  setIsNicknameValid={setIsNicknameValid}
                />
                <SignUpKorName
                  korName={korName}
                  setKorName={setKorName}
                />
                <SignUpPassword
                  setPassword={setPassword}
                  setPasswordCheck={setPasswordCheck}
                  isPasswordEqual={isPasswordEqual}
                  setIsPasswordValid={setIsPasswordValid}
                />

                <Grid item xs={12} sx={{mt:5}}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <FormControlLabel
                        control={<Checkbox value="allowTOS" color="primary" onChange={onChangeAllowTos}/>}
                        label="(필수) 서비스 이용약관 동의"
                      />
                      </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                      <strong>제1조(목적)</strong>
                      <br/>
                      이 약관은 AndCrowd (전자상거래 사업자)가 운영하는 &Crowd에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.

                      ※「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <FormControlLabel
                        control={<Checkbox value="allowPrivacy" color="primary" onChange={onChangeAllowPrivacy} />}
                        label="(필수) 개인정보 동의"
                      />
                      </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <strong>개인정보 동의</strong>
                        <br />
                        &Crowd는 "개인정보 보호법"에 따라 본인의 동의를 받아 개인정보를 수집 및 이용합니다.
                        <br />
                        1. 개인정보 수집 목적: &Crowd 회원 관리자
                        <br />
                        2. 개인정보 수집 항목: 성명, 이메일, 휴대폰 번호
                        <br />
                        3. 보유 및 이용기간
                        <br />
                        - 보유기간: 회원 등록기간
                        - 이용기간: 해당 서비스 제공 기간
                      </Typography>

                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <FormControlLabel
                        control={<Checkbox value="allowMarketing" color="primary" onChange={onChangeAllowMarketing} />}
                        label="(선택) 마케팅 동의"
                      />
                      </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        본 마케팅 정보 수신에 대한 동의를 거부하실 수 있으며, 이 경우 회원가입은 가능하나 일부 서비스 이용 및 각종 광고, 할인, 이벤트 및 이용자 맞춤형 상품 추천 등의 서비스 제공이 제한될 수 있습니다. 
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ height: '6vh', mt: 9, mb: 2, fontSize:'22px',
                fontWeight:500 }}
              >
                가입하기
              </Button>
            </Box>
          </Box>
        </Container>
    );
};

export default Signup;
