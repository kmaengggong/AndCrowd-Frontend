import { Avatar, Button, Grid, IconButton, Chip} from "@mui/material";
import Typography from '@mui/joy/Typography';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const Teammate = ({
    name, githubUrl, profileUrl, role, parts, introduce
}) => {
    console.log(parts);

    return(
        <Grid container xs={12} marginBottom={2} >
            <CardActionArea href={githubUrl}>
                <Card variant="outlined" sx={{display:'flex'}}>
                <CardMedia
                    sx={{width:200, height:200, display:'block'}}
                    image={profileUrl}
                />
                <CardContent sx={{flex:1}}>
                    {
                        parts === undefined
                        ?
                        <></>
                        :
                        parts.map((part) => 
                            <Chip label={part}  color="primary" variant="outlined" size="small" sx={{marginBottom:1, marginRight:1}} />
                        )
                    }
                    <Typography sx={{fontSize:22, fontWeight:700}}>
                        {name}
                    </Typography>
                    <Typography sx={{fontSize:18, marginBottom:1, fontWeight:600, color:"grey"}}>
                        {role}
                    </Typography>
                    
                    <Typography sx={{color:"grey"}}>
                        {introduce}
                    </Typography>
                </CardContent>

                </Card>
            </CardActionArea>
        </Grid>
    );
}

export default Teammate;