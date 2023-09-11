import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import { Grid } from '@mui/material';

const MyPageEmtpyCard = ({type}) => {
    const projectTitle = {
        and: "아직 참여한 모임이 없습니다!",
        crowd: "아직 후원한 펀딩이 없습니다!",
        like: "아직 찜한 프로젝트가 없습니다!"
    };
    const projectContent = {
        and: "& 모임에 참여해보세요!",
        crowd: "Crowd 펀딩에 후원해보세요!",
        like: "&Crowd 프로젝트를 찜해보세요!"
    };
    const types = {
        and: "/and/list",
        crowd: "/crowd/list",
        like: "/and/list"
    };

    return (
        <Grid item xs={4}>
            <Card sx={{ maxWidth: '100%', boxShadow: 'lg' }}>
                <CardOverflow>
                    <AspectRatio sx={{ minWidth: 200 }}>
                        <img src="https://picsum.photos/id/2/600/400" alt="임시 이미지" loading="lazy"/>
                    </AspectRatio>
                </CardOverflow>
                <CardContent>
                    <Link
                        href={types[type]}
                        fontWeight="md"
                        color="neutral"
                        textColor="text.primary"
                        overlay
                        endDecorator={<ArrowOutwardIcon />}
                    >
                        {projectTitle[type]}
                    </Link>
                    <Typography
                        level="title-lg"
                        sx={{ mt: 1, fontWeight: 'xl' }}
                    >
                        {/* (목표금액 - 모은금액) 자료 불러오기 */}
                        {projectContent[type]}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default MyPageEmtpyCard;