import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import { Grid } from '@mui/material';

const MyPageCard = ({project, type}) => {
    const projectId = {
        and: project.andId,
        order: project.crowdId,
        like: project.projectId,
    };
    const projectImg = {
        and: project.andHeaderImg,
        order: project.crowdHeaderImg,
        like: project.projectHeaderImg,
    };
    const projectTitle = {
        and: project.andTitle,
        order: project.crowdTitle,
        like: project.projectTitle,
    };
    const projectContent = {
        and: project.andContent,
        order: project.crowdContent,
        like: '',
    };
    const types = {
        and: 'and',
        order: 'crowd',
        like: project.projectType === 0 ? 'and' : 'crowd',
    };
    
    return (
        <Card sx={{ maxWidth: '100%', boxShadow: 'lg' }}>
            <CardOverflow>
                <AspectRatio>
                {project[type] !== null ?
                    <img src={projectImg[type]} alt="헤더 이미지" loading="lazy"/>
                :
                    <img src="https://picsum.photos/id/2/600/400" alt="임시 이미지" loading="lazy"/>
                }
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Chip component="span" size="sm" variant="soft" color="success">
                    {/* (마감일자 - 현재일자)자료 불러오기 */}
                    <b>10</b> 일 남음
                </Chip>
                <Link
                    href={`/${types[type]}/` + projectId[type]}
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
                    sx={{ mt: 1, fontWeight: 'xl', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block'}}
                    // sx={{ mt: 1, fontWeight: 'xl', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}
                >
                    {projectContent[type]}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MyPageCard;