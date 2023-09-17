import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import { Grid } from '@mui/material';

const MyPageEmtpyCard = ({type}) => {
    const projectTitle = {
        and: "아직 참여한 모임이 없습니다!",
        order: "아직 후원한 펀딩이 없습니다!",
        like: "아직 찜한 프로젝트가 없습니다!",
        makerAnd: "아직 모집한 모임이 없습니다!",
        makerCrowd: "아직 시작한 펀딩이 없습니다!"
    };
    const projectContent = {
        and: "& 모임에 참여해보세요!",
        order: "Crowd 펀딩에 후원해보세요!",
        like: "&Crowd 프로젝트를 찜해보세요!",
        makerAnd: "여러 사람들과 함께하는 모임을 만들어보세요!",
        makerCrowd: "좋은 아이템이 있나요? 펀딩을 시작해보세요!"
    };
    const types = {
        and: "/and/list",
        order: "/crowd/list",
        like: "/and/list",
        makerAnd: "/and/create",
        makerCrowd: "/crowd/create"
    };

    return (
        <Card sx={{ maxWidth: '100%', boxShadow: 'lg' }}>
            <CardOverflow>
                <AspectRatio>
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
                    sx={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block'}}
                >
                    {projectTitle[type]}
                </Link>
                <Typography
                    level="title-md"
                    sx={{ mt: 1, fontWeight: 'xl', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}
                >
                    {projectContent[type]}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MyPageEmtpyCard;