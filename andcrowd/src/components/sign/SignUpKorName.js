import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"

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