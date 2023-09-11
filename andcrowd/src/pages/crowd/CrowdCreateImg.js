import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import { Box, Button, CssBaseline, Input, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from "@mui/material/Grid";
import { styled } from '@mui/system';
import styles from '../../styles/crowd/CrowdCreateImg.css';
import { AiOutlinePlus, AiTwotoneDelete } from "react-icons/ai";
import axios from "axios";

const CrowdCreateImg = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        headerImg: "",
        crowdImg1: "",
        crowdImg2: "",
        crowdImg3: "",
        crowdImg4: "",
        crowdImg5: "",
    });

    const handleFileChange = async (e, fileType) => { // 파일 업로드
        const files = e.target.files;
        const newFormData = new FormData(); // 현재 formData를 복사
    
        newFormData.append("crowdId", crowdId);
        newFormData.append("fileType", "headerImg");
    
        // 여러 개의 파일을 추가
        for (let i = 0; i < Math.min(files.length, 6); i++) {
            newFormData.append("file" + i, files[i]); // 파일마다 고유한 이름 사용
            newFormData.append("fileType" + i, fileType + i); // 파일 타입도 고유한 이름 사용
        }
    
        try {
            const response = await axios.post("/crowd/s3/uploads", newFormData, {
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

    const VisuallyHiddenInput = styled('input')`
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
        white-space: nowrap;
        width: 1px;
        `;

    const handleUploadCancel = () => {
        alert("작성이 취소되었습니다.");
        navigate('/crowd/list'); // 업로드 취소 버튼 클릭 시 페이지 전환
    };

    return( 
        <div className={styles.addPicture}>
            <label htmlFor="input-file" className={styles.addButton} onChange={handleAddImages}>
                <input type="file" id="input-file" multiple className={styles.addButton} />
                <AiOutlinePlus fill="#646F7C" />
                <span>사진추가</span>
            </label>

            {/* 저장해둔 이미지들을 순회하면서 화면에 이미지 출력 */}
            {showImages.map((image, id) => (
                <div className={styles.imageContainer} key={id}>
                <img src={image} alt={`${image}-${id}`} />
                <AiTwotoneDelete onClick={() => handleDeleteImage(id)} />
                </div>
            ))}
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
        </div>

        // <Container component="main" maxWidth="md">
        //     <CssBaseline />
        //     <Box
        //         sx={{
        //             marginTop: 8,
        //             display: 'flex',
        //             flexDirection: 'column',
        //             alignItems: 'left',
        //             ml: 5,
        //             mr: 5
        //           }}
        //     >
        //     <Box component="form" noValidate onSubmit={handleFileChange} sx={{ mt: 3 }}>
        //         <Grid container spacing={1} style={{  display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        //             <Button
        //                 onClick={() => {
        //                     const inputElement = document.createElement("input");
        //                     inputElement.type = "file";
        //                     inputElement.accept = "image/*";
        //                     inputElement.style.display = "none";
        //                     inputElement.onchange = (e) => handleFileChange(e, "headerImg");
        //                     inputElement.click();
        //                 }}
        //                 variant="contained"
        //                 startIcon={<CloudUploadIcon />}
        //                 style={{ margin: "5px" }}
        //             >
        //                 Header Image 업로드
        //             </Button>
        //             {/* 이미지 1 업로드 버튼 */}
        //             <Button
        //                 onClick={() => {
        //                     const inputElement = document.createElement("input");
        //                     inputElement.type = "file";
        //                     inputElement.accept = "image/*";
        //                     inputElement.style.display = "none";
        //                     inputElement.onchange = (e) => handleFileChange(e, "crowdImg1");
        //                     inputElement.click();
        //                 }}
        //                 variant="contained"
        //                 startIcon={<CloudUploadIcon />}
        //                 style={{ margin: "5px" }}
        //             >
        //                 본문 이미지 1 업로드
        //             </Button>
        //             {/* 이미지 2 업로드 버튼 */}
        //             <Button
        //                 onClick={() => {
        //                     const inputElement = document.createElement("input");
        //                     inputElement.type = "file";
        //                     inputElement.accept = "image/*";
        //                     inputElement.style.display = "none";
        //                     inputElement.onchange = (e) => handleFileChange(e, "crowdImg2");
        //                     inputElement.click();
        //                 }}
        //                 variant="contained"
        //                 startIcon={<CloudUploadIcon />}
        //                 style={{ margin: "5px" }}
        //             >
        //                 본문 이미지 2 업로드
        //             </Button>
        //             {/* 이미지 3 업로드 버튼 */}
        //             <Button
        //                 onClick={() => {
        //                     const inputElement = document.createElement("input");
        //                     inputElement.type = "file";
        //                     inputElement.accept = "image/*";
        //                     inputElement.style.display = "none";
        //                     inputElement.onchange = (e) => handleFileChange(e, "crowdImg3");
        //                     inputElement.click();
        //                 }}
        //                 variant="contained"
        //                 startIcon={<CloudUploadIcon />}
        //                 style={{ margin: "5px" }}
        //             >
        //                 본문 이미지 3 업로드
        //             </Button>
        //             {/* 이미지 4 업로드 버튼 */}
        //             <Button
        //                 onClick={() => {
        //                     const inputElement = document.createElement("input");
        //                     inputElement.type = "file";
        //                     inputElement.accept = "image/*";
        //                     inputElement.style.display = "none";
        //                     inputElement.onchange = (e) => handleFileChange(e, "crowdImg4");
        //                     inputElement.click();
        //                 }}
        //                 variant="contained"
        //                 startIcon={<CloudUploadIcon />}
        //                 style={{ margin: "5px" }}
        //             >
        //                 본문 이미지 4 업로드
        //             </Button>
        //             {/* 이미지 5 업로드 버튼 */}
        //             <Button
        //                 onClick={() => {
        //                     const inputElement = document.createElement("input");
        //                     inputElement.type = "file";
        //                     inputElement.accept = "image/*";
        //                     inputElement.style.display = "none";
        //                     inputElement.onchange = (e) => handleFileChange(e, "crowdImg5");
        //                     inputElement.click();
        //                 }}
        //                 variant="contained"
        //                 startIcon={<CloudUploadIcon />}
        //                 style={{ margin: "5px" }}
        //             >
        //                 본문 이미지 5 업로드
        //             </Button>
        //         </Grid>
        //         <Grid>
        //             {/* 업로드 버튼 */}
        //             <Button
        //                 onClick={handleSubmit}>
        //                     업로드
        //             </Button>
        //             {/* 업로드 취소시 */}
        //             <Button
        //             onClick={handleUploadCancel}>
        //                 업로드 취소
        //             </Button>
        //         </Grid>
        //     </Box> 
        //     </Box>
        // </Container>
    );
};

export default CrowdCreateImg;