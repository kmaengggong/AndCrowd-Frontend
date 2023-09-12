import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

const FindId = () => {
    const [email, setEmail] = useState(null);

    const onEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
    const onClickFindIdButton = () => {
        console.log(email);

        try{
            fetch("/isEmailExists", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "userEmail": email
                })
            }).then(res => {
                if(!res.ok){
                    alert("해당 이메일로 가입한 계정이 없습니다.");
                }
                else{
                    alert("해당 이메일로 가입한 계정이 있습니다.");
                }
            })
        } catch(error){
            console.error("")
        }
    };

    return(
        <Box
            sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Grid container spacing={2} maxWidth='sm'>
                <Grid item xs={12} textAlign={'center'} marginBottom={5}>
                    <Typography fontSize={22} fontWeight={700}>
                        아이디 찾기
                    </Typography>
                </Grid>
                <TextField
                    required
                    fullWidth
                    name="email"
                    label="가입한 이메일을 입력해주세요"
                    type="email"
                    sx={{ mb: 2}}
                    onChange={onEmailChange}
                />
                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2}}
                    onClick={onClickFindIdButton}
                    >
                        아이디 찾기
                </Button>
            </Grid>
        </Box>
    );
}

export default FindId;