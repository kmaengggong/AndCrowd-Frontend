import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"

export const SignUpAuthNumber = ({
        authNumber,
        setIsAuthNumberValid
    }) => {

    const [inputAuthNumber, setInputAuthNumber] = useState('');
        
    const onInputAuthNumberChange = (event) => {
        setInputAuthNumber(event.currentTarget.value.trim());
        setIsAuthNumberValid(false);
    }

    const onAuthNumberCheckButtonClick = (event) => {
        event.preventDefault();
        console.log(authNumber);
        console.log(inputAuthNumber);
        if(inputAuthNumber.match(authNumber)){
            alert("인증 성공!");
            setIsAuthNumberValid(true);
        }
        else{
            alert("인증번호가 틀렸습니다.");
        }
    }

    return (
        <>
            <Grid item xs={12} sm={9}>
                <TextField
                    required
                    fullWidth
                    name="auth-number"
                    label="인증번호"
                    type="auth-number"
                    id="auth-number"
                    onChange={onInputAuthNumberChange}
                    // disabled={isEmailValid || !authNumber ? true : false}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={onAuthNumberCheckButtonClick}
                    // disabled={isEmailValid || !authNumber ? true : false}
                >
                    인증하기
                </Button>
            </Grid>
        </>
    )
}