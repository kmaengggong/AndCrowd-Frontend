import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import { Box, Button, CssBaseline, Input, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CrowdCreateImg = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const handleFileChange = async (e) => { // 파일 업로드
        const files = e.target.files;
        const formData = new FormData();
        formData.append("crowdId", crowdId);
        formData.append("fileType", "headerImg");
        // 여러 개의 파일을 추가
        for (let i = 0; i < Math.min(files.length, 6); i++) {
            formData.append("file" + i, files[i]); // 파일마다 고유한 이름 사용
            formData.append("fileType" + i, "crowdImg" + i); // 파일 타입도 고유한 이름 사용
        }

        try {
            const response = await fetch("/crowd/s3/uploads", {
                method: "POST",
                body: formData,
                headers: {
                    ACL: "public-read",
                },
            });
            if (response.ok) {
                console.log("Files uploaded successfully");
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }

    };

    const handleSubmit = async (e) => { // 파일 제출
        e.preventDefault();
        console.log("formData: ", formData);

        const response = await fetch(`/crowd/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert("펀딩글 등록이 완료되었습니다. 심사는 5-7일 정도 소요됩니다.");
            navigate(`/crowd/list`);
        } else {
            console.error("Error creating AndRole");
        }
    };

    const handleUploadCancel = () => {
        alert("작성이 취소되었습니다.");
        navigate('/crowd/list'); // 업로드 취소 버튼 클릭 시 페이지 전환
    };

    return( 
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    ml: 5,
                    mr: 5
                  }}
            >
            <Box component="form" noValidate onSubmit={handleFileChange} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Button
                    onClick={handleSubmit}
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    >
                    Upload a file
                <VisuallyHiddenInput type="file" />
                </Button>
                <Button
                onClick={handleUploadCancel}>
                    취소
                </Button>
            </Grid>
            </Box> 
            </Box>
        </Container>
    );
};

export default CrowdCreateImg;