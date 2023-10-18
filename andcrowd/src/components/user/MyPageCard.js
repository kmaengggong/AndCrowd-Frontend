// 마이페이지 카드

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Grid, IconButton } from '@mui/material';
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
        makerAnd: project.andCategoryId,
        makerCrowd: project.crowdCategoryId
    };
    const projectEndDate = {
        and: project.andEndDate,
        order: project.crowdEndDate,
        like: project.projectEndDate,
        makerAnd: project.andEndDate,
        makerCrowd: project.crowdEndDate
    }
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

    function calculateRemainingDays(projectEndDate) {
        const now = new Date();
        const end = new Date(projectEndDate);
        const diffInMs = end - now;

        const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000)) + 1;

        return diffInDays >= 0 ? 'D - '+ diffInDays : '모집마감';
    }
    
    return (
        <Card sx={{ maxWidth: '100%', boxShadow: 'lg' }}>
            <CardOverflow>
                <AspectRatio>
                {project[type] !== null ?
                    <img src={projectImg[type]} alt="" loading="lazy"/>
                :
                    <img src="https://picsum.photos/id/2/600/400" alt="" loading="lazy"/>
                }
                </AspectRatio>
            </CardOverflow>
            <Grid container>
            <Grid item xs={10}>
            <CardContent>
                {/* (마감일자 - 현재일자)자료 불러오기 */}
                {/* <Chip component="span" size="sm" variant="soft" color="success">
                    <b>{Math.ceil((new Date(projectEndDate[type]) - new Date()) / (1000 * 60 * 60 *24))}</b> 일 남음
                </Chip> */}
                <Chip component="span" size="md" variant="soft" color="success"
                sx={{ position: 'absolute', top: '0.875rem', right: '0.7rem' }}>
                    <b>{calculateRemainingDays(projectEndDate[type])}</b>
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
                {/* <Typography
                    level="title-md"
                    sx={{ mt: 1, fontWeight: 'xl', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block'}}
                    // sx={{ mt: 1, fontWeight: 'xl', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}
                >
                    {categoryMap[projectCategory[type]]}
                </Typography> 수정 */} 
                <Chip variant="outlined"
                    sx={{ mt: 1, fontWeight: 'light', color: '#787878' }}>
                        # {categoryMap[projectCategory[type]]}
                </Chip>
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