import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import { CardActionArea, CardActions, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chat from '@mui/icons-material/Chat';

const MyPageCard = ({project, type}) => {
    const projectId = {
        and: project.andId,
        order: project.crowdId,
        like: project.projectId,
        makerAnd: project.andId,
        makerCrowd: project.crowdId
    };
    const projectImg = {
        and: project.andHeaderImg,
        order: project.headerImg,
        like: project.projectHeaderImg,
        makerAnd: project.andHeaderImg,
        makerCrowd: project.headerImg
    };
    const projectTitle = {
        and: project.andTitle,
        order: project.crowdTitle,
        like: project.projectTitle,
        makerAnd: project.andTitle,
        makerCrowd: project.crowdTitle
    };
    const projectCategory = {
        and: project.andCategoryId,
        order: project.crowdCategoryId,
        like: '',
        makerAnd: project.andContent,
        makerCrowd: project.crowdContent
    };
    const types = {
        and: 'and',
        order: 'crowd',
        like: project.projectType === 0 ? 'and' : 'crowd',
        makerAnd: 'and',
        makerCrowd: 'crowd'
    };
    const categoryMap = {
        1: '문화 예술',
        2: '액티비티 스포츠',
        3: '테크 가전',
        4: '푸드',
        5: '언어',
        6: '여행',
        7: '반려동물',
        8: '기타',
      };

    const navigate = useNavigate();
    
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
            <Grid container>
            <Grid item xs={10}>
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
                    {categoryMap[projectCategory[type]]}
                </Typography>
            </CardContent>
            </Grid>
            {(type === 'and' || type ==='makerAnd') &&
            <Grid item xs={2}>
                <CardActionArea sx={{height:15}}>
                    <IconButton onClick={() => navigate(`/and/${projectId[type]}/chat`)}>
                        <Chat sx={{color:'#00D337'}}/>
                    </IconButton>
                </CardActionArea>
            </Grid>
            }
            </Grid>
        </Card>
    );
}

export default MyPageCard;