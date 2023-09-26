// 회원가입 이름 컴포넌트

import { Grid, TextField } from "@mui/material"

export const SignUpKorName = ({
    korName,
    setKorName
    }) => {
        
    const onInputKorNameChange = (event) => {
        setKorName(event.currentTarget.value.trim());
    }

    return (
        <>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="kor-name"
                    label="이름"
                    type="kor-name"
                    id="kor-name"
                    onChange={onInputKorNameChange}
                    // disabled={isEmailValid || !authNumber ? true : false}
                />
            </Grid>
        </>
    )
}