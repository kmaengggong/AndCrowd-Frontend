import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router"
import { GetUserId } from "../user/GetUserId";
import { GetUserInfo } from "../user/GetUserInfo";

const SignRoute = ({}) => {
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [email, setEmail] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setUserId(GetUserId());
    }, []);

    useEffect(() => {
        if(userId !== null){
            GetUserInfo(userId, setUserInfo);
        }
    }, [userId]);

    useEffect(() => {
        setEmail(userInfo.userEmail);
    }, [userInfo]);

    const onPasswordChange = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onClickPasswordCheckButton = (event) => {
        event.preventDefault();
        try{
            fetch('/passwordCheck', {
                method: "POST",
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({
                    "userEmail": email,
                    "userPassword": password
                })
            }).then(res => {
                console.log(res);
                if(res.ok){
                    setIsValid(true);
                }
                else{
                    alert("비밀번호가 틀렸습니다.");
                    navigate(-1);
                }
            })
        } catch(error){
            console.error("onClickPasswordCheckButton: " + error);
        }
    }

    return (
        <>
        {isValid === true ?
            <Outlet />
            :
            <Box
                sx={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            <Grid container spacing={2} maxWidth={'sm'}>
                <Grid item xs={12} textAlign={'center'}>
                    <h3>소중한 개인정보 보호를 위해 비밀번호를 입력해주세요</h3>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="비밀번호"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={onPasswordChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={onClickPasswordCheckButton}
                    >
                        비밀번호 입력
                    </Button>
                </Grid>
            </Grid>
            </Box>
        }
        </>
    )
    // return(
    //     !isLogin ? <Navigate to="/" /> : link
    // );
}

export default SignRoute;