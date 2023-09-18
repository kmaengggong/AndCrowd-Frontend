import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isLoginContext } from "../../../context/isLoginContext";
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField } from "@mui/material";
import { SignUpNickname } from "../SignUpNickname";
import { GetUserId } from "../../user/GetUserId";
import Typography from "@mui/joy/Typography";

const CallBackFromOAuth = () => {
    const {isLogin, setIsLogin} = useContext(isLoginContext);
    const [serachParams] = useSearchParams();
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [allowTos, setAllowTos] = useState(0);
    const [allowPrivacy, setAllowPrivacy] = useState(0);
    const [allowMarketing, setAllowMarketing] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if(serachParams.get("isSignup")){
            localStorage.setItem('access_token', serachParams.get('token'));
            setIsLogin(true);
            navigate("/");
        }
    }, []);

    const onNameChange = (event) => {
        setName(event.currentTarget.value.trim());
    };
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
        if(name.length < 1){
            alert("이름을 확인해 주세요.");
            return;
        }
        if(!isNicknameValid){
            alert("닉네임을 확인해 주세요.");
            return;
        }
        if(!(allowTos && allowPrivacy)){
          alert("필수 동의 약관에 동의해주세요.");
          return;
        }
        
        try{
            await fetch('/updateForSocial', {
                method: "POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": serachParams.get('userEmail'),
                    "userNickname": nickname,
                    "userKorName": name,
                    "userTos": allowTos,
                    "userPrivacy": allowPrivacy,
                    "userMarketing": allowMarketing
                })
            }).then((res) => {
                if(!res.ok){
                    alert("관리자 계정 가입에 실패했습니다.");
                }
                else{
                    alert("소셜 계정 가입에 성공했습니다!");
                    localStorage.setItem('access_token', serachParams.get('token'));
                    setIsLogin(true);
                    navigate("/");
                }
            })
        } catch(error){
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Typography sx={{fontSize:30, marginTop:5, marginBottom:3, textAlign:'center', fontWeight:700, color:'gray'}}>추가 정보를 입력해주세요</Typography>

            <Box component={"form"} onSubmit={onFormSubmit} 
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 5,
                    mr: 5
                }}
            >
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="이름"
                            onChange={onNameChange}
                        />
                    </Grid>
                    <SignUpNickname
                        nickname={nickname}
                        setNickname={setNickname}
                        setIsNicknameValid={setIsNicknameValid}
                    />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowTOS" color="primary" onChange={onChangeAllowTos}/>}
                    label="(필수) 서비스 이용약관 동의"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowPrivacy" color="primary" onChange={onChangeAllowPrivacy} />}
                    label="(필수) 개인정보 동의"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowMarketing" color="primary" onChange={onChangeAllowMarketing} />}
                    label="(선택) 마케팅 동의"
                  />
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    가입하기
                </Button>
            </Box>
        </Container>
    );
}

export default CallBackFromOAuth;