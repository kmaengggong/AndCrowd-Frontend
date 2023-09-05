import { Grid, TextField } from "@mui/material";

export const SignUpPassword = ({
        setPassword,
        setPasswordCheck,
        isPasswordEqual,
        setIsPasswordValid
    }) => {

    const onPasswordChange = (event) => {
        setPassword(event.currentTarget.value);
        setIsPasswordValid(false);
    };
    
    const onPasswordCheckChange = (event) => {
        setPasswordCheck(event.currentTarget.value);
        setIsPasswordValid(false);
    };

    return (
        <>
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
        </>
    );
};