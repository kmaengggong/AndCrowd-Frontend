import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GetUserId } from "../../components/user/GetUserId";

const UserPasswordChange = () => {
    const params = useParams();
    const userId = params.userId;
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isPasswordEqual, setIsPasswordEqual] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
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

    const onPasswordChange = (event) => {
        setPassword(event.currentTarget.value);
        setIsPasswordValid(false);
    };
    
    const onPasswordCheckChange = (event) => {
        setPasswordCheck(event.currentTarget.value);
        setIsPasswordValid(false);
    };

    const onClickPasswordChangeButton = () => {
        if(!isPasswordValid){
            alert("비밀번호를 확인해주세요.");
            return;
        }

        try{
            fetch(`/user/${userId}`, {
                method: "PATCH",
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json; text=utf-8'
                },
                body: JSON.stringify({
                    "userPassword": password
                })
            }).then(res => {
                console.log(res);
            })
        } catch(error){
            console.error("onClickPasswordChangeButton: " + error);
        }
        
        alert("비밀번호가 변경되었습니다.");
        navigate("/");
    }

    return (
        <>
            <Grid container spacing={2}>
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
                    <TextField
                        required
                        fullWidth
                        name="password-check"
                        label="비밀번호 확인"
                        type="password"
                        onChange={onPasswordCheckChange}
                        id="password-check"
                        helperText={isPasswordEqual ? "" : "비밀번호가 일치하지 않습니다."}
                        error={isPasswordEqual ? false : true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={onClickPasswordChangeButton}
                    >
                        변경
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default UserPasswordChange;