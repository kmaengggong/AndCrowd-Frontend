import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const Loading = () => {
    return(
    <Box sx={{textAlign:'center', mt:25}}>
        <CircularProgress color="success" />
    </Box>
    )
};

export default Loading;