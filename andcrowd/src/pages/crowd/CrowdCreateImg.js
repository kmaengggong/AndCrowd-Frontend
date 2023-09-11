import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import { Box, Button, CssBaseline } from "@mui/material";
import Grid from "@mui/material/Grid";
import styles from '../../styles/crowd/CrowdCreateImg.css';
import { AiTwotoneDelete } from "react-icons/ai";
import axios from "axios";
import CreateImgUploadBtn from "./CreateImgUploadBtn";

const CrowdCreateImg = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const crowdId = params.crowdId;

    const [formData, setFormData] = useState({
        headerImg: "",
        crowdImg1: "",
        crowdImg2: "",
        crowdImg3: "",
        crowdImg4: "",
        crowdImg5: "",
    });

    const handleFileChange = async (e, fileType) => { // 파일 업로드
        const files = e.target.files[0];
        const newFormData = new FormData(); // 현재 formData를 복사
    
        newFormData.append("crowdId", crowdId);
        newFormData.append("fileType", "headerImg");

        // 새로운 이미지를 추가할 때마다 showImages 배열에 이미지 URL 추가
        const newShowImages = [...showImages];
    
        // 여러 개의 파일을 추가
        for (let i = 0; i < Math.min(files.length, 6); i++) {
            newFormData.append("file" + i, files[i]); // 파일마다 고유한 이름 사용
            newFormData.append("fileType" + i, fileType + i); // 파일 타입도 고유한 이름 사용
            // 이미지 URL을 생성하고 배열에 추가
            const imageUrl = URL.createObjectURL(files[i]);
            newShowImages.push(imageUrl);
        }

        setShowImages(newShowImages); // 미리보기 이미지 목록 업데이트
    
        try {
            const response = await axios.post("/crowd_s3/uploads", {
                method: "POST",
                body: newFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    ACL: "public-read", // ACL 헤더를 설정합니다.
                },
            });
            if (response.status === 200) {
                console.log("Files uploaded successfully");
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [showImages, setShowImages] = useState([]);

    // 이미지 상대경로 저장
    const handleAddImages = (event) => {
        const imageLists = event.target.files;
        let imageUrlLists = [...showImages];

        for (let i = 0; i < imageLists.length; i++) {
        const currentImageUrl = URL.createObjectURL(imageLists[i]);
        imageUrlLists.push(currentImageUrl);
        }

        if (imageUrlLists.length > 10) {
        imageUrlLists = imageUrlLists.slice(0, 10);
        }

        setShowImages(imageUrlLists);
    };

    // X버튼 클릭 시 이미지 삭제
    const handleDeleteImage = (id) => {
        setShowImages(showImages.filter((_, index) => index !== id));
    };

    const handleSubmit = async (e) => { // 파일 제출
        e.preventDefault();
        console.log("formData: ", formData);

        const response = await fetch(`/crowd/${crowdId}/img/create`, {
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
            console.error("Error creating crowd");
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
                <Grid container spacing={1} style={{  display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <CreateImgUploadBtn fileType="headerImg" handleFileChange={handleFileChange}  />
                    {Array.from({ length: 6 }, (_, index) => (
                        <CreateImgUploadBtn
                            key={index}
                            fileType={`crowdImg${index + 1}`}
                            handleFileChange={handleFileChange}
                        />
                        ))}
                    {/* 미리보기 이미지를 출력 */}
                    {showImages.map((image, id) => (
                        <div className={styles.imageContainer} key={id}>
                            <img src={image} alt={`${image}-${id}`}/>
                            <AiTwotoneDelete onClick={() => handleDeleteImage(id)} />
                        </div>
                    ))}
                </Grid>
                <Grid>
                    {/* 업로드 버튼 */}
                    <Button
                        onClick={handleSubmit}>
                            업로드
                    </Button>
                    {/* 업로드 취소시 */}
                    <Button
                    onClick={handleUploadCancel}>
                        업로드 취소
                    </Button>
                </Grid>
            </Box> 
            </Box>
        </Container>
    );
};

export default CrowdCreateImg;