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
    1: '문화 예술',
    2: '액티비티 스포츠',
    3: '테크 가전',
    4: '푸드',
    5: '언어',
    6: '여행',
    7: '반려동물',
    8: '기타',
  };

const AndSearchCard = ({project, type}) => {
    const projectId = {
        and: project.andId,
        crowd: project.crowdId,
    };
    const projectImg = {
        and: project.andHeaderImg,
        crowd: project.headerImg,
    };
    const projectTitle = {
        and: project.andTitle,
        crowd: project.crowdTitle,
    };
    const projectCategory = {
        and: project.andCategoryId,
        crowd: project.crowdCategoryId,
    };
    const projectEndDate = {
        and: project.andEndDate,
        crowd: project.crowdEndDate,
    };
    const types = {
        and: 'and',
        crowd: 'crowd',
    };
    
    function calculateRemainingDays(projectEndDate) {
        const now = new Date();
        const end = new Date(projectEndDate);
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
                <Chip component="span" size="md" variant="soft" color="success"
                 sx={{ position: 'absolute', top: '0.875rem', right: '0.7rem' }}>
                    <b>{calculateRemainingDays(projectEndDate[type])}</b>
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