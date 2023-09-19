// import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import Cookies from 'js-cookie';
// import { InputAdornment } from "@mui/material";
// import CrowdCategoryCreate from "./CrowdCategoryCreate";
// import { GetUserId } from "../../components/user/GetUserId";
// import CrowdCreateImg from "../../components/crowd/CrowdCreateImg";

// const CrowdCreate = () => {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null); // userId를 상태로 설정
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const [formData, setFormData] = useState({
//     crowdCategoryId: "",
//     crowdTitle: "",
//     crowdContent: "",
//     crowdGoal: 0,
//     crowdEndDate: new Date().toISOString().slice(0, 16)
//   });
  
//   // userId를 백엔드로부터 가져오는 로직
//   useEffect(() => {
//     setUserId(GetUserId());
//     console.log(new Date().toISOString().slice(0, 16));
//   }, []);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     let newValue = value;
//     // 만약 입력된 값이 숫자가 아니라면 무시
//     if (name === "crowdGoal") {
//       // 목표 금액 필드에서는 음수 금액 입력시 0으로 설정
//       newValue = Math.max(0, parseFloat(newValue));
//     }
//     setFormData({
//       ...formData,
//       [name]: newValue,
//     });
//     // 모금액이 0원인 경우에만 알림을 표시
//     if (name === "crowdGoal" && parseFloat(newValue) === 0) {
//       alert("모금액은 0원일 수 없습니다. 다시 입력해주세요.");
//     }
//   };

//   const handleCategorySelect = (event) => {
//     handleInputChange(event);
//   };  

//   const handleNextButtonClick = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/crowd/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           userId: userId,
//         }),
//       });
//       if (response.ok) {
//         // 성공적으로 데이터 전송 및 처리되었을 때의 코드
//         // 데이터를 저장하고 이동할 경로를 지정합니다.
//         const responseData = await response.json();
//         const crowdId = responseData; // 응답 데이터에서 crowdId 값을 추출
//         console.log("Created crowdId:", crowdId);
//         navigate(`/crowd/${crowdId}/reward`);
//       } else {
//         throw new Error(`Request failed with status ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error sending data:", error);
//     }
//   };

//   const handleUploadCancel = () => {
//     alert("업로드가 취소되었습니다.");
//     navigate(`/crowd/list`);
//   }

//   // 모금액 필드의 유효성 검사를 추가
//   const isCrowdGoalValid = formData.crowdGoal !== "" && formData.crowdGoal >= 0;

//   return ( // 화면단 입력 구문 시작
//     <>
//     {userId === null ? <></> :
//     <Container component="main" maxWidth="md">
//       <CssBaseline />
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'left',
//           ml: 5,
//           mr: 5
//         }}
//       >
//         <Typography component="h1" variant="h5" style={{ lineHeight: '2' }}>
//           우리의 꿈과 열정을 함께 나누어주세요 🌟<br />
//           여러분의 따뜻한 지원과 사랑으로 이 프로젝트를 실현하고자 합니다.<br />
//           함께하는 모든 순간이 소중하고, 우리의 미래에 희망을 안겨줄 것입니다.<br />
//           감사함과 함께, 함께하는 여정을 시작해봅시다!
//         </Typography>
//         <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleNextButtonClick}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={5}>
//               <TextField 
//                 required
//                 fullWidth
//                 label="회원번호"
//                 defaultValue={userId}
//                 disabled
//               />
//             </Grid>
//             {/* 카테고리 선택 */}
//             <CrowdCategoryCreate 
//             value={formData.crowdCategoryId} 
//             onChange={handleCategorySelect} />
//             {/*  */}
//             <Grid item xs={12} sm={9}>
//                 <TextField 
//                   required
//                   fullWidth
//                   id="crowdTitle"
//                   label="펀딩 제목"
//                   name="crowdTitle"
//                   value={formData.crowdTitle}
//                   onChange={handleInputChange}
//                   placeholder="제목을 입력하세요"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={9}>
//                 <TextField 
//                   required
//                   fullWidth
//                   multiline
//                   rows={4}
//                   id="crowdContent"
//                   label="펀딩 본문"
//                   name="crowdContent"
//                   value={formData.crowdContent}
//                   onChange={handleInputChange}
//                   placeholder="예) OOO한 내용을 기획/개발해 &Crowd에 최초 공개하고자 합니다."
//                 />
//               </Grid>
//               {/* 마감일자 선택 */}
//               <Grid item xs={12} sm={10}>
//                 <TextField
//                   fullWidth
//                   required
//                   type="datetime-local"
//                   id="crowdEndDate"
//                   label="펀딩 마감 일자"
//                   name="crowdEndDate"
//                   value={formData.crowdEndDate}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               {/* 목표금액 설정구문 */}
//               <Grid item xs={12} sm={9}>
                // <TextField
                //   fullWidth
                //   required
                //   type="number"
                //   id="crowdGoal"
                //   label="목표 금액"
                //   name="crowdGoal"
                //   value={formData.crowdGoal}
                //   onChange={handleInputChange}
                //   InputProps={{
                //     endAdornment: (
                //       <InputAdornment position="end">
                //         <div className="text-primary fw-700">원</div>
                //       </InputAdornment>
                //     )
                //   }}
                // />
//               </Grid>
//           </Grid>
//           <hr />
//           <Container component="main" maxWidth="md">
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 disabled={!isCrowdGoalValid}
//               >
//                 다음
//               </Button>
//             </Container>
//         </Box>
//         <Container component="main" maxWidth="md">
//           <Button
//             type="button"
//             onClick={handleUploadCancel}
//             variant="contained"
//             color="inherit"
//           >
//             업로드 취소
//           </Button>
//         </Container>
//       </Box>
//     </Container>
//     }
//     </>
//   );
// };

// export default CrowdCreate;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/and/AndCreate.css';
import { Typography } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId'; 
import CrowdEditor from "../../components/crowd/CrowdEditor";

const CrowdCreate = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동 함수를 가져옵니다.

  const [userId, setUserId] = useState("");
  const { crowdId } = useParams();
  const [formData, setFormData] = useState({
    crowdCategoryId: "",
    crowdTitle: "",
    crowdContent: "",
    crowdEndDate: "",
    crowdGoal: "",
    crowdHeaderImg: ""
  });

  const fetchData = async () => {
    setUserId(GetUserId());
      try {
        const response = await fetch(`/crowd/${crowdId}`);
        
        if (response.ok) {
          const data = await response.json();
          setFormData(data); // 기존 데이터를 모두 할당
        } else {
          throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
  
      } catch (error) {
        console.error("Error fetching And data:", error);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [htmlStr, setHtmlStr] = React.useState('');

  const updatedFormData = {
    ...formData,
    userId: userId,
  };  


  // "다음" 버튼 클릭 시 실행될 함수
  const handleNextButtonClick = async () => {
    try {
      const response = await fetch(`/crowd/${crowdId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFormData, crowdContent: htmlStr, crowdStatus: 4 }),
      });
      navigate(`/crowd/${crowdId}/reward`);
      if (response.ok) {
        const responseData = await response.json();
        const crowdId = responseData;
        console.log("Created crowdId:", crowdId);
  
        navigate(`/crowd/${crowdId}`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" style={{ lineHeight: '2' }}>
        우리의 꿈과 열정을 함께 나누어주세요 🌟<br />
        여러분의 따뜻한 지원과 사랑으로 이 프로젝트를 실현하고자 합니다.<br />
        함께하는 모든 순간이 소중하고, 우리의 미래에 희망을 안겨줄 것입니다.<br />
        감사함과 함께, 함께하는 여정을 시작해봅시다!
      </Typography>
      <form onSubmit={handleNextButtonClick}>
        <div id='crowd-create-box'>
          <Typography id='crowd-title-text'>
            펀딩글의 제목을 적어주세요
          <span className='red-asterisk'>*</span>
          </Typography>
          <input
            type="text"
            name="crowdTitle"
            placeholder="제목 입력"
            id='create-crowd-title'
            
            onChange={handleInputChange}
          />
          <Typography id='crowd-title-text'>
            펀딩글의 내용을 적어주세요
          <span className='red-asterisk'>*</span>
          </Typography>
          <div>
          <CrowdEditor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></CrowdEditor>
          </div>
        </div>
        
        <div id="submit_btn">
          <button id='next-button' type="button" onClick={handleNextButtonClick}>
            다음
          </button>
        </div>
      </form>
    </>
  );
};

export default CrowdCreate;
