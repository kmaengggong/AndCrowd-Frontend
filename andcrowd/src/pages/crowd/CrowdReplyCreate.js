// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { GetUserId } from "../../components/user/GetUserId";
// import {Modal,Button,TextField,Box,TableCell,TableRow,Typography} from "@mui/material";
// import SubdirectoryArrowRightRounded from "@mui/icons-material/SubdirectoryArrowRightRounded";

// const style = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 400,
//     bgcolor: "background.paper",
//     boxShadow: 24,
//     borderRadius: "8px",
//     p: 4,
// };

// const CrowdReplyCreate = () => {
//     const navigate = useNavigate();
//     const params = useParams();
//     const crowdId = params.crowdId;
//     const crowdQnaId = params.crowdQnaId;
//     const [crowdReplyList, setCrowdReplyList] = useState({});

//     const [userId, setUserId] = useState("");

//     const [formData, setFormData] = useState({
//         crowdId: crowdId,
//         userId: "",
//         crowdQnaId: crowdQnaId,
//         qnaReplyContent: "",
//     });

//     useEffect(() => {
//         setUserId(GetUserId);
//     },[]);

//     const handleInputChange = (e) => {
//         const {name, value} = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const updatedFormData = {
//         ...formData,
//         userId: userId,
//     };

//     const handleSubmit = async (crowd) => {
//         // e.preventDefault();
//         console.log("formdata:",formData);

//         // 현재 로그인한 사용자의 userId
//         const currentUserUserId = userId;
    
//         // 'crowd'의 userId
//         const crowdUserId = crowd.userId;
    
//         // userId 비교
//         if (currentUserUserId !== crowdUserId) {
//             alert("답변은 crowd 글 작성자만 작성할 수 있습니다.");
//             return navigate(`/crowd/${crowdId}/qna`);
//         }

//         const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updatedFormData),
//         });
//         if (response.ok) {
//             const createdData = await response.json();
//             setCreatedQnaReplyId(createdData.qnaReplyId); // 생성된 QnaReply의 ID를 설정
//             console.log("생성된 crowdQnaId:", createdQnaReplyId);
//             navigate(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
//         }
//     };

//     return(
//         <div>
//             <>
//                 {Object.keys(crowdReplyList).length > 0 ? (
//                 Object.keys(crowdReplyList).map(
//                     (replyId) => {
//                     const comment =
//                         crowdReplyList[replyId];
//                     return (
//                         <React.Fragment
//                         key={comment.qnaReplyId}
//                         >
//                         <TableRow>
//                             <TableCell
//                             align="right"
//                             sx={{
//                                 width: "10%",
//                                 paddingBottom: 2,
//                                 paddingTop: 2,
//                             }}
//                             >
//                             {" "}
//                             <SubdirectoryArrowRightRounded
//                                 color="action"
//                             />{" "}
//                             </TableCell>
//                             <TableCell
//                             sx={{
//                                 width: "45%",
//                                 paddingBottom: 2,
//                                 paddingTop: 2,
//                             }}
//                             >
//                             {comment.qnaReplyContent}
//                             <Button
//                                 size="small"
//                                 sx={{
//                                 minWidth: "40px",
//                                 ml: 2,
//                                 }}
//                                 onClick={() => {
//                                 handleOpenReplyModal(
//                                     crowdId,
//                                     crowdQna.crowdQnaId,
//                                     comment.qnaReplyId
//                                 );
//                                 }}
//                             >
//                                 수정
//                             </Button>
//                             <Button
//                                 size="small"
//                                 color="error"
//                                 sx={{
//                                 minWidth: "40px",
//                                 }}
//                                 onClick={() =>
//                                 deleteCrowdReply(
//                                     crowdId,
//                                     crowdQna.crowdQnaId,
//                                     comment.qnaReplyId
//                                 )
//                                 }
//                             >
//                                 삭제
//                             </Button>

//                             <Modal
//                                 open={openReplyModal}
//                                 onClose={handleCloseReplyModal}
//                                 aria-labelledby="modal-modal-title"
//                                 aria-describedby="modal-modal-description"
//                             >
//                                 <Box sx={style}>
//                                 <Typography
//                                     id="modal-modal-description"
//                                     sx={{ mt: 2, mb: 1 }}
//                                 >
//                                     <TextField
//                                     fullWidth
//                                     multiline
//                                     rows={3}
//                                     id="outlined-basic"
//                                     label="답변 내용"
//                                     variant="outlined"
//                                     margin="normal"
//                                     size="small"
//                                     type="text"
//                                     name="qnaReplyContent"
//                                     value={
//                                         replyFormData.qnaReplyContent
//                                     }
//                                     onChange={
//                                         handleQnaReplyInputChange
//                                     }
//                                     />
//                                 </Typography>
//                                 <Button
//                                     onClick={() => {
//                                     handleUpdateQnaReply(
//                                         crowdId,
//                                         crowdQna.crowdQnaId,
//                                         comment.qnaReplyId
//                                     );
//                                     }}
//                                 >
//                                     수정
//                                 </Button>
//                                 </Box>
//                             </Modal>
//                             </TableCell>
//                             <TableCell
//                             sx={{
//                                 width: "15%",
//                                 paddingBottom: 2,
//                                 paddingTop: 2,
//                             }}
//                             >
//                             {comment.userNickname}
//                             </TableCell>
//                             <TableCell
//                             sx={{
//                                 width: "15%",
//                                 paddingBottom: 2,
//                                 paddingTop: 2,
//                             }}
//                             >
//                             {formatDate(
//                                 comment.updatedAt
//                             )}
//                             </TableCell>
//                         </TableRow>
//                         </React.Fragment>);
//                     })
//                 ) : (
//                 <TableRow>
//                     <TableCell
//                     colSpan={4}
//                     sx={{
//                         padding: 2,
//                         paddingLeft: 8,
//                         borderBottom: "none",
//                         borderTop: "none",
//                     }}
//                     >
//                     등록된 답변이 없습니다.
//                     </TableCell>
//                 </TableRow>
//                 )}
//                 {/* 관리자인 경우에만 qna 댓글 작성 가능 */}
//                 {crowdId.userId === userId && (
//                 <TableRow>
//                 <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10, paddingBottom: 0, paddingTop: 3, borderBottom: "none" }}>
//                     <TextField
//                     fullWidth
//                     id="standard-multiline-static"
//                     multiline
//                     rows={1}
//                     variant="standard"
//                     color="success"
//                     name="qnaReplyContent"
//                     onChange={handleInputChange}
//                     value={formData.qnaReplyContent}
//                     />
//                 </TableCell>

//                 {/* 저장 버튼 */}
//                 <TableCell sx={{ borderBottom: "none", paddingTop: 2 }}>
//                     <Button color="success" onClick={() => handleSubmit(crowdQna.crowdQnaId)}>
//                     저장
//                     </Button>
//                 </TableCell> 
//                 </TableRow>   
//                 )}
//             </>
//         </div>
//     )
// }

// export default CrowdReplyCreate;