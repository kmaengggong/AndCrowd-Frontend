// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import CrowdToolBar from "../../components/crowd/CrowdToolBar";
// import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Collapse } from "@mui/material";
// import { GetUserId } from "../../components/user/GetUserId";
// import { getUserNickname } from "../../components/and/userApi";
// import axios from "axios";

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     borderRadius: '8px',
//     p: 4,
// };

// const CrowdQnaList = (props) => {
//     const navigate = useNavigate();
//     const params = useParams();
//     const crowdId = params.crowdId;
//     const [crowdQnaList, setCrowdQnaList] = useState([]);
//     const [selectedQnaId, setSelectedQnaId] = useState(null);
//     const [crowdReplyList, setCrowdReplyList] = useState({});
//     const [openQna, setOpenQna] = useState(false);
//     const [qnaReplyData, setQnaReplyData] = useState({});

//     const [openModal, setOpenModal] = useState(false);
//     const handleCloseModal = () => setOpenModal(false);
//     const handleOpenModal = (crowdId, crowdQnaId) => {
//         fetchQnaData(crowdId, crowdQnaId);
//         setOpenModal(true);
//     }

//     const [openReplyModal, setOpenReplyModal] = useState(false);
//     const handleCloseReplyModal = () => setOpenReplyModal(false);
//     const handleOpenReplyModal = (crowdId, crowdQnaId, qnaReplyId) => {
//         fetchQnaReplyData(crowdId, qnaReplyId);
//         setOpenReplyModal(true);
//     };
//     const userId = GetUserId();

//     const [formData, setFormData] = useState({
//         crowdId: crowdId,
//         userId: userId,
//         qnaReplyContent: "",
//         crowdQnaId: '',
//     });

//     const [qnaFormData, setQnaFormData] = useState({
//         crowdId: crowdId,
//         crowdQnaId: '',
//         userId: userId,
//         qnaTitle: "",
//         qnaContent: "",
//     });

//     const [replyFormData, setReplyFormData] = useState({
//         crowdQnaId: crowdQnaId,
//         crowdQnaId: '',
//         qnaReplyId: '',
//         qnaReplyContent: "",
//     });

//     const fetchQnaReplyData = async (crowdId, crowdQnaId, qnaReplyId) => {
//         try {
//             const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`);

//             if (response.ok) {
//                 const data = await response.json();
//                 setReplyFormData(data);
//             } else {
//                 throw new Error(`Fetching crowd data failed with status ${response.status}.`);
//             }
//         } catch(error) {
//             console.error("데이터를 가져오는 중 오류:" , error);
//         }
//     };

//     const fetchQnaData = async (crowdId, crowdQnaId) => {
//         try {
//             const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 setQnaFormData(data);
//             } else {
//                 throw new Error(`Fetching crowd data failed with status ${response.status}.`);
//             }
//         } catch(error) {
//             console.error("Error fetching crowd Qna data:", error);
//         }
//     }

//     const fetchReplyStatusData = async (crowdId, crowdQnaId) => {
//         try {
//             const qnaReplyResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
//             if(qnaReplyResponse.ok) {
//                 const qnaReplyData = await qnaReplyResponse.json();
//                 setQnaReplyData((prevData) => ({
//                     ...prevData,
//                     [crowdQnaId]: qnaReplyData,
//                 }));
//             } else {
//                 throw new Error(`Fetching crowd data failed with status ${qnaReplyResponse.status}.`);
//             }
//         } catch(error) {
//             console.error("Error fetching crowd data:", error);
//         }
//     }

//     const handleQnaClick = (qnaId) => {
//         setOpenQna(!openQna);
//         if(selectedQnaId === qnaId){
//             fetchReplyData(crowdId, qnaId)
//             setSelectedQnaId(null);
//         } else {
//             fetchReplyData(crowdId, qnaId)
//             setSelectedQnaId(qnaId);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [crowdId, crowdQnaId]);

//     const fetchData = async () => {
//         try {
//             const qnaResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/`);
//             if(qnaResponse.ok) {
//                 const qnaData = await qnaResponse.json();
//                 setCrowdQna(qnaData);
//             }else {
//                 throw new Error(`Fetching crowd data failed with status ${qnaResponse.status}.`);
//             }
//             const qnaReplyResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
//             if(qnaReplyResponse.ok) {
//                 const qnaReplyData = await qnaReplyResponse.json();
//                 setQnaReplies(qnaReplyData);
//             } else {
//                 throw new Error(`Fetching crowd data failed with status ${qnaReplyResponse.status}.`);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchReplyData = async (crowdId, crowdQnaId) => {
//         try {
//             const qnaReplyResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
//             if(qnaReplyResponse.ok) {
//                 const qnaReplyData = await qnaReplyResponse.json();

//                 for(const replyId in qnaReplyData) {
//                     const comment = qnaReplyData[replyId];
//                     const userNickname = await getUserNickname(comment.userId);
//                     comment.userNickname = userNickname;
//                 }
//                 setCrowdReplyList(qnaReplyData);
//             } else {
//                 throw new Error(`Fetching crowd data failed with status ${qnaReplyResponse.status}.`);
//             }
//         } catch(error) {
//             console.error("Error fetching crowd data:", error);
//         }
//     };

//     const handleInputChange = (e) => {
//         const {name, value} = e.target;
//         setFormData ({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleQnaReplyInputChange = (e) => {
//         const {name, value} = e.target;
//         setReplyFormData({
//             ...replyFormData,
//             [name]: value,
//         });
//     };

//     const handleQnaInputChange = (e) => {
//         const {name, value} = e.target;
//         setQnaFormData({
//             ...qnaFormData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (crowdQnaId) => {
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             crowdQnaId: crowdQnaId,
//         }));

//         const updatedFormData = {
//             ...formData,
//             crowdQnaId: crowdQnaId,
//         };

//         const response = await fetch(`/crowd/${crowdId}/qna`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updatedFormData),
//         });

//         if(response.ok) {
//             fetchReplyData(crowdId, crowdQnaId);

//             setFormData((prevFormData) => ({
//                 ...prevFormData,
//                 qnaReplyContent: "",
//             }));
//             fetchReplyStatusData(crowdId, crowdQnaId);
//         }
//     };

//     const handleUpdateQnaReply = async (crowdId, crowdQnaId, qnaReplyId) => {
//         console.log(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`);

//         setReplyFormData((prevFormData) => ({
//             ...prevFormData,
//             crowdQnaId: crowdQnaId,
//             qnaReplyId: qnaReplyId,
//         }));

//         const updatedFormData = {
//             ...replyFormData,
//             crowdQnaId: crowdQnaId,
//             qnaReplyId: qnaReplyId,
//         };
//         console.log("수정된 폼 데이터:", updatedFormData);

//         const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updatedFormData),
//         });

//         if(response.ok) {
//             fetchReplyData(crowdId, crowdQnaId, qnaReplyId);

//             setReplyFormData((prevFormData) => ({
//                 ...prevFormData,
//                 qnaReplyContent: "",
//             }));

//             fetchReplyStatusData(crowdId, crowdQnaId, qnaReplyId);
//             handleCloseReplyModal();
//         }
//     };

//     const deleteCrowdQna = async (crowdId, crowdQnaId) => {
//         try {
//             const response = await axios.delete(`/crowd/${crowdId}/qna/${crowdQnaId}/delete`);
//             if(response.status === 200) {
//                 fetchData();
//             }
//         } catch (error) {
//             console.error("error in deleting crowd:", error);
//         }
//     }

//     const handleUpdateQna = async (crowdId, crowdQnaId) => {
//         try{
//             const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(qnaFormData),
//             });
//             if (response.status === 200) {
//                 console.log('업데이트 되었습니다.');
//                 handleCloseModal();
//                 fetchData();
//             }
//         } catch(error) {
//             console.error("error in deleting crowd:", error);
//         }
//     };

//     const deleteCrowdReply = async (crowdId, crowdQnaId, qnaReplyId) => {
//         try {
//             await axios.delete(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}/delete`);
//             console.log("Deleted crowd with ID:", crowdQnaId);
//             fetchReplyData(crowdId, crowdQnaId);
//             fetchReplyStatusData(crowdId, crowdQnaId);
//         } catch (error) {
//             console.error("error in deleting crowd:", error);
//         }
//     };

//     const createQna = (crowdId) => {
//         navigate(`/crowd/${crowdId}/qna`);
//     }

//     const formatDate = (dateTimeString) => { // 날짜, 시간 사이의 TimeZone 표시 제거
//         if (!dateTimeString) return ""; 
      
//         const formattedString = dateTimeString.replace("T", " ");
      
//         return formattedString;
//     };
    
//     return(
//         <div id='qna-container'>
//             <CrowdToolBar crowdId={crowdId} />
//             <div id='qna-box'>
//                 <div className="title">
//                     <h2>Q&A</h2>
//                 </div>
//                 <div className="create">
//                     <Button onClick={() => createQna(andId)}
//                         variant="outlined" color="success">
//                             문의 글 작성
//                         </Button>
//                 </div>
//             </div>
//             <TableContainer>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell align="center">답변상태</TableCell>
//                             <TableCell align="center">제목</TableCell>
//                             <TableCell align="center">작성자</TableCell>
//                             <TableCell align="center">작성일</TableCell>
//                         </TableRow>
//                     </TableHead>

//                     <TableBody>
//                         {crowdQnaList.map((crowdQna) => (
//                             <>
//                             <TableRow hover key={crowdQna.crowdQnaId} style={{height: 50}}>
//                                 <TableCell align="center" sx={{width: '10%', borderBottom: "none"}}>
//                                     {qnaReplyData[crowdQna.crowdQnaId]?.length > 0 ? (<p>답변완료</p>) : (<p>미답변</p>)}
//                                 </TableCell>
//                                 <TableCell align="center" sx={{width: '15%', borderBottom: "none"}}>{crowdQna.userNickname}</TableCell>
//                                 <TableCell align="center" sx={{width: '15%', borderBottom: "none"}}>{formatDate(crowdQna.updatedAt)}</TableCell>
//                             </TableRow>

//                             <TableRow> 
//                             <TableCell style={{ padding: 0, borderBottom:"none" }} colSpan={4}>
//                                 <Collapse in={selectedQnaId === crowdQna.crowdQnaId} timeout="auto" unmountOnExit>
//                                 <Box sx={{ padding: 2, background: '#f6f8f6' }}>
//                                     <Table size="small" aria-label="CrowdQnaReply">
//                                     <TableBody>
//                                         {selectedQnaId === crowdQna.crowdQnaId && (
//                                         <>
//                                         <TableRow>
//                                             <TableCell colSpan={4} sx={{ padding: 2, paddingLeft: 8, borderBottom: 'none', borderTop: 'none' }} >
//                                             {crowdQna.qnaContent}
//                                             </TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell align="right" colSpan={4} sx={{ padding: 2, paddingBottom: 4, paddingRight: 5 }}>
//                                             <Button size="small" sx={{ minWidth: '40px' }}
//                                                 onClick={() =>{ handleOpenModal(crowdId, crowdQna.crowdQnaId); 
//                                                 }}
//                                             >수정</Button> 
//                                             <Button size="small" color="error" sx={{ minWidth: '40px' }} 
//                                             onClick={() => deleteAndQna(crowdId, crowdQna.crowdQnaId)}>삭제</Button>

//                                             <Modal
//                                                 open={openModal}
//                                                 onClose={handleCloseModal}
//                                                 aria-labelledby="modal-modal-title"
//                                                 aria-describedby="modal-modal-description"
//                                             >
//                                                 <Box sx={style}>
//                                                 <Typography id="modal-modal-title" variant="h6" component="h2">
//                                                     <TextField fullWidth id="outlined-basic" label="문의 제목" variant="outlined" size="small" sx={{ mt: 1 }}
//                                                     type="text" name="andQnaTitle" value={qnaFormData.qnaTitle} 
//                                                     onChange={handleQnaInputChange} />
//                                                 </Typography>
//                                                 <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
//                                                     <TextField fullWidth multiline rows={3} id="outlined-basic" label="문의 내용" variant="outlined" margin="normal" size="small" 
//                                                     type="text" name="andQnaContent" value={qnaFormData.qnaContent} 
//                                                     onChange={handleQnaInputChange}/>
//                                                 </Typography>
//                                                 <Button onClick={() =>{ handleUpdateQna(crowdId, crowdQna.crowdQnaId); }}>수정</Button>
//                                                 </Box>
//                                             </Modal>
//                                             </TableCell>
//                                         </TableRow>
//                                         </>
//                                         )}
//                                         {selectedQnaId === crowdQna.crowdQnaId && (
//                                         <>
//                                             {Object.keys(crowdReplyList).length > 0 ? (
//                                             Object.keys(crowdReplyList).map((replyId) => {
//                                                 const comment = crowdReplyList[replyId];
//                                                 return (
//                                                 <React.Fragment key={comment.andReplyId}>
//                                                     <TableRow >
//                                                     <TableCell align="right" sx={{ width: '10%', paddingBottom: 2, paddingTop: 2 }} > <SubdirectoryArrowRightRoundedIcon color="action"/> </TableCell>
//                                                     <TableCell sx={{ width: '45%', paddingBottom: 2, paddingTop: 2 }}>
//                                                         {comment.andReplyContent}
//                                                         <Button size="small" sx={{ minWidth: '40px', ml: 2 }}
//                                                         onClick={() =>{ handleOpenReplyModal(andId, andQna.andQnaId, comment.andReplyId); 
//                                                         }}
//                                                         >수정</Button> 
//                                                         <Button size="small" color="error" sx={{ minWidth: '40px' }} 
//                                                         onClick={() => deleteAndReply(andId, andQna.andQnaId, comment.andReplyId)}>삭제</Button>

//                                                         <Modal
//                                                         open={openReplyModal}
//                                                         onClose={handleCloseReplyModal}
//                                                         aria-labelledby="modal-modal-title"
//                                                         aria-describedby="modal-modal-description"
//                                                         >
//                                                         <Box sx={style}>
//                                                             <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
//                                                             <TextField fullWidth multiline rows={3} id="outlined-basic" label="답변 내용" variant="outlined" margin="normal" size="small" 
//                                                             type="text" name="andReplyContent" value={replyFormData.andReplyContent} 
//                                                             onChange={handleQnaReplyInputChange}/>
//                                                             </Typography>
//                                                             <Button onClick={() =>{ handleUpdateQnaReply(andQna.andQnaId, comment.andReplyId); }}>수정</Button>
//                                                         </Box>
//                                                         </Modal>
//                                                     </TableCell>
//                                                     <TableCell align="center" sx={{ width: '10%',  paddingBottom: 2, paddingTop: 2 }}>{comment.userNickname}</TableCell>
//                                                     <TableCell align="center" sx={{ width: '10%',  paddingBottom: 2, paddingTop: 2 }}>{formatDate(comment.updatedAt)}</TableCell>
//                                                     </TableRow>
//                                                 </React.Fragment>
//                                                 );
//                                             })
//                                             ) : (
//                                             <TableRow>
//                                                 {/* <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10 }} >
//                                                 답변이 없습니다.
//                                                 </TableCell>
//                                                 <TableCell /> */}
//                                             </TableRow>
//                                             )}
                                            
//                                             <TableRow>
//                                                 <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10, paddingBottom: 0, paddingTop: 3, borderBottom: "none" }}>
//                                                 <TextField
//                                                     fullWidth
//                                                     id="standard-multiline-static"
//                                                     multiline
//                                                     rows={1}
//                                                     variant="standard"
//                                                     color="success"
//                                                     name="andReplyContent"
//                                                     onChange={handleInputChange}
//                                                     value={formData.andReplyContent}
//                                                 />
//                                                 </TableCell>

//                                                 {/* 저장 버튼 */}
//                                                 <TableCell sx={{ borderBottom: "none", paddingTop: 2 }}>
//                                                 <Button color="success" onClick={() => handleSubmit(andQna.andQnaId)}>
//                                                     저장
//                                                 </Button>
//                                                 </TableCell> 
//                                             </TableRow>   
//                                                     </>
//                                                     )}
//                                                 </TableBody>
//                                                 </Table>
                                                
//                                             </Box>
//                                             </Collapse>
//                                         </TableCell>
//                                         </TableRow>
//                             </>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             {/* <h3>QnA를 자유롭게 올려보세요</h3>
//             <div>
//                 {crowdQnaList.map((crowdQna) => (
//                     <div key={crowdQna.crowdQnaId}>
//                         <Typography display={"inline"}>
//                             <div
//                             onClick={() => handleQnaClick(crowdQna.crowdQnaId)}
//                             style={{
//                                 cursor: 'pointer'
//                             }}
//                             >
//                                 {crowdQna.qnaTitle}
//                             </div>
//                         </Typography>
//                         <Typography>{formatDate(crowdQna.updatedAt)}</Typography>
//                         <hr />
//                         {selectedQnaId === crowdQna.crowdQnaId && (
//                             <div 
//                             style={{
//                                 cursor: 'pointer'
//                             }}>
//                             <h2>{crowdQna.qnaContent}</h2>
//                             </div>
//                         )}
//                         {selectedQnaId === crowdQna.crowdQnaId && (
//                             <div>
//                                 <hr />
//                                 {crowdReplyList.length > 0 ? (
//                                     crowdReplyList.map(comment => (
//                                         <div key={comment.qnaReplyId}>
//                                             <p>{comment.qnaReplyContent}</p>
//                                             <p>{formatDate(comment.updatedAt)}</p>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>답변이 없습니다.</p>
//                                 )}
//                                 <hr/>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//             <Link to={`/crowd/${crowdId}/qna/`}>글 작성</Link> */}
//         </div>
//     );
// };

// export default CrowdQnaList;