import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import { Box, Button, CssBaseline } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AiTwotoneDelete } from "react-icons/ai";
import axios from "axios"; // axios 라이브러리를 import
import CreateImgUploadBtn from "./CreateImgUploadBtn";
import styles from "../../styles/crowd/CrowdCreateImg.css";
import CrowdCreateImg from "../../components/crowd/CrowdCreateImg";

const CrowdUploadImg = () => {
  const navigate = useNavigate();
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

  // const handleFileChange = async (e, fileType) => {
  //   const files = e.target.files;
  //   const newFormData = new FormData();

  //   newFormData.append("crowdId", crowdId);

  //   // 각 이미지에 대한 파일 업로드 처리
  //   for (let i = 0; i < Math.min(files.length, 6); i++) {
  //     newFormData.append(`files${i}`, files[i]); // 각 이미지에 대한 파일 추가
  //     newFormData.append(`fileType${i}`, fileType); // 각 이미지에 대한 파일 타입 추가
  //   }

  //   try {
  //     const response = await axios.post(`/api/crowd/upload-images`, newFormData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data", // 올바른 Content-Type으로 수정
  //       },
  //     });
  //     if (response.status === 200) {
  //       console.log("Files uploaded successfully");
  //       // 파일 업로드가 성공하면 해당 파일 경로를 formData에 저장
  //       for (let i = 0; i < Math.min(files.length, 6); i++) {
  //         setFormData((prevFormData) => ({
  //           ...prevFormData,
  //           [fileType + i]: response.data[i].fileUrl,
  //         }));
  //       }
  //     } else {
  //       throw new Error(`Request failed with status ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const [showImages, setShowImages] = useState([]);

  // const handleAddImages = (event) => {
  //   // 이미지 미리보기 기능은 유지되며 따로 수정할 필요가 없습니다.
  //   // 이미지 미리보기는 사용자가 선택한 이미지를 미리 보여주는 역할을 합니다.
  //   const imageLists = event.target.files;
  //   let imageUrlLists = [...showImages];

  //   for (let i = 0; i < imageLists.length; i++) {
  //     const currentImageUrl = URL.createObjectURL(imageLists[i]);
  //     imageUrlLists.push(currentImageUrl);
  //   }

  //   if (imageUrlLists.length > 10) {
  //     imageUrlLists = imageUrlLists.slice(0, 10);
  //   }

  //   setShowImages(imageUrlLists);
  // };

  // const handleDeleteImage = (id) => {
  //   // 이미지 삭제 기능은 유지되며 따로 수정할 필요가 없습니다.
  //   // 사용자가 업로드한 이미지를 삭제합니다.
  //   setShowImages(showImages.filter((_, index) => index !== id));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("formData: ", formData);

  //   // 이미지 파일 경로를 포함한 formData를 서버로 전송합니다.
  //   const response = await axios.post(`/api/crowd/${crowdId}/img/create`, formData, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   if (response.status === 200) {
  //     alert("펀딩글 등록이 완료되었습니다. 심사는 5-7일 정도 소요됩니다.");
  //     navigate(`/crowd/list`);
  //   } else {
  //     console.error("Error creating crowd");
  //   }
  // };

  // const handleUploadCancel = () => {
  //   alert("작성이 취소되었습니다.");
  //   navigate("/crowd/list"); // 업로드 취소 버튼 클릭 시 페이지 전환
  // };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          ml: 5,
          mr: 5,
        }}
      >
        <CrowdCreateImg />
        {/* <Box component="form" noValidate onSubmit={handleFileChange} sx={{ mt: 3 }}>
          <Grid container spacing={1} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <CreateImgUploadBtn fileType="headerImg" handleFileChange={handleFileChange} />
            {Array.from({ length: 6 }, (_, index) => (
              <CreateImgUploadBtn
                key={index}
                fileType={`crowdImg${index + 1}`}
                handleFileChange={handleFileChange}
              />
            ))}
            {showImages.map((image, id) => (
              <div className={styles.imageContainer} key={id}>
                <img src={image} alt={`${image}-${id}`} />
                <AiTwotoneDelete onClick={() => handleDeleteImage(id)} />
              </div>
            ))}
          </Grid>
          <Grid>
            <Button onClick={handleSubmit}>업로드</Button>
            <Button onClick={handleUploadCancel}>업로드 취소</Button>
          </Grid>
        </Box> */}
      </Box>
    </Container>
  );
};

export default CrowdUploadImg;
