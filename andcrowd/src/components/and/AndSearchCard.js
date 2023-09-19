import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import { Grid } from '@mui/material';

const categoryMap = {
    2: '문화 예술',
    3: '액티비티 스포츠',
    4: '테크 가전',
    5: '푸드',
    6: '언어',
    7: '여행',
    8: '반려동물',
    9: '기타',
  };

const AndSearchCard = ({project, type}) => {
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
    const projectCategory = {
        and: project.andCategoryId,
        order: project.crowdCategoryId,
        like: '',
    };
    const types = {
        and: 'and',
        order: 'crowd',
        like: project.projectType === 0 ? 'and' : 'crowd',
    };
    
    function calculateRemainingDays(andEndDate) {
        const now = new Date();
        const end = new Date(andEndDate);
        const diffInMs = end - now;
        
        const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000)) + 1;
    
        return diffInDays >= 0 ? 'D - '+ diffInDays : '모집 마감';
    }
    

    return (
        <Card variant="outlined" sx={{ maxWidth: '100%', boxShadow: 'lg', borderRadius: "8px", borderColor: '#f2f0f0'  }}>
            <CardOverflow>
                <AspectRatio ratio="1.5">
                {project[type] !== null ?
                    <img src={projectImg[type]} alt="헤더 이미지" loading="lazy"/>
                :
                    <img src="https://picsum.photos/id/2/600/400" alt="임시 이미지" loading="lazy"/>
                }
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Chip component="span" size="sm" variant="soft" color="success"
                 sx={{ position: 'absolute', top: '0.875rem', right: '0.7rem' }}>
                    <b>{calculateRemainingDays(project.andEndDate)}</b>
                </Chip>
                <Link
                    href={`/${types[type]}/` + projectId[type]}
                    fontWeight="lg"
                    color="neutral"
                    textColor="text.primary"
                    overlay
                    sx={{overflow:'hidden', fontSize: 20, textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block'}}
                >
                    {projectTitle[type]}
                </Link>
                <Chip variant="outlined"
                    sx={{ mt: 1, fontWeight: 'light', color: '#787878' }}
                >
                    # {categoryMap[projectCategory[type]]}
                </Chip>
            </CardContent>
        </Card>
    );
}

export default AndSearchCard;