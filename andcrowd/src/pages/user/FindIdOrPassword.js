import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FindIdOrPassword = () => {
    const navigate = useNavigate();

    const onClickFindIdButton = () => {
        navigate("/findId");
    }
    const onClickFindPasswordButton = () => {
        navigate("/findPassword");
    }
    
    return (
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
                        아이디 혹은 비밀번호를 잊어버리셨나요?
                    </Typography>
                </Grid>
                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2}}
                    onClick={onClickFindIdButton}
                    >
                        아이디 찾기
                </Button>
                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2}}
                    onClick={onClickFindPasswordButton}
                    >
                        비밀번호 찾기
                </Button>
            </Grid>
        </Box>
    );
}

export default FindIdOrPassword;