import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import {Modal,Button,TextField,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,Collapse} from "@mui/material";
import { GetUserId } from "../../components/user/GetUserId";
import { getUserNickname } from "../../components/and/userApi";
import axios from "axios";
import SubdirectoryArrowRightRounded from "@mui/icons-material/SubdirectoryArrowRightRounded";
import "../../styles/crowd/CrowdQna.css";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

const MyPaginate = styled(ReactPaginate).attrs({
  activeClassName: "active",
})`
  margin: 50px 16px;
  display: flex;
  justify-content: center;
  list-style-type: none;
  padding: 0 5rem;
  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    cursor: pointer;
  }
  li.previous a,
  li.next a {
    color: #63b762;
  }
  li.active a {
    color: #91cd96;
    font-weight: 700;
    min-width: 32px;
  }
  li.disabled a {
    color: #a6a6a6;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

const CrowdQnaList = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const crowdId = params.crowdId;
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [crowdQnaList, setCrowdQnaList] = useState([]);
  const [selectedQnaId, setSelectedQnaId] = useState(null);
  const [crowdReplyList, setCrowdReplyList] = useState({});
  const { row } = props;
  const [openQna, setOpenQna] = useState(false);
  const [qnaReplyData, setQnaReplyData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false); // crowd작성자 여부

  const userId = GetUserId();

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = (crowdId, crowdQnaId) => {
    fetchQnaData(crowdId, crowdQnaId);
    setOpenModal(true);
  };

  const [openReplyModal, setOpenReplyModal] = useState(false);
  const handleCloseReplyModal = () => setOpenReplyModal(false);
  const handleOpenReplyModal = (crowdId, crowdQnaId, qnaReplyId) => {
    fetchQnaReplyData(crowdId, crowdQnaId, qnaReplyId);
    setOpenReplyModal(true);
  };

  const [formData, setFormData] = useState({ // qna + Reply
    crowdId: crowdId,
    userId: userId,
    qnaReplyContent: "",
    crowdQnaId: "",
  });

  const [qnaFormData, setQnaFormData] = useState({ // qna
    crowdId: crowdId,
    crowdQnaId: "",
    userId: userId,
    qnaTitle: "",
    qnaContent: "",
  });

  const [replyFormData, setReplyFormData] = useState({ // qnaReply
    crowdId: crowdId,
    crowdQnaId: "",
    qnaReplyId: "",
    userId: userId,
    qnaReplyContent: "",
  });

  useEffect(() => {
    checkUserPermission();
  }, [crowdId]);

  const crowdQnaId = params.crowdQnaId;

  const checkUserPermission = async () => {
    try{
      const userId = GetUserId();
      const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/user-check/${userId}`);

      if(response.ok) {
        const isAdmin = await response.json();
        setIsAdmin(isAdmin);
        console.log(isAdmin);
      } else {
        throw new Error(`Fetching admin status failed with status ${response.status}.`);
      }
    } catch (error){
      console.error("Error checking admin status:", error);
    }
  }

  const fetchQnaReplyData = async (crowdId, crowdQnaId, qnaReplyId) => {
    try {
      const response = await fetch(
        `/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (!isAdmin) {
          alert("답변은 펀딩글 제작자만 가능합니다.");
        }
        setReplyFormData(data);
      } else {
        throw new Error(
          `Fetching crowd data failed with status ${response.status}.`
        );
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 오류:", error);
    }
  };

  const fetchQnaData = async (crowdId, crowdQnaId) => {
    try {
      const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}`);
      if (response.ok) {
        const data = await response.json();
        setQnaFormData(data);
      } else {
        throw new Error(
          `Fetching crowd data failed with status ${response.status}.`
        );
      }
    } catch (error) {
      console.error("Error fetching crowd Qna data:", error);
    }
  };

  const fetchReplyStatusData = async (crowdId, crowdQnaId) => {
    try {
      const qnaReplyResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
      if (qnaReplyResponse.ok) {
        const qnaReplyData = await qnaReplyResponse.json();
        setQnaReplyData((prevData) => ({
          ...prevData,
          [crowdQnaId]: qnaReplyData,
        }));
      } else {
        throw new Error(
          `Fetching crowd data failed with status ${qnaReplyResponse.status}.`
        );
      }
    } catch (error) {
      console.error("Error fetching crowd data:", error);
    }
  };

  const handleQnaClick = (qnaId) => {
    setOpenQna(!openQna);
    if (selectedQnaId === qnaId) {
      fetchReplyData(crowdId, qnaId);
      setSelectedQnaId(null);
    } else {
      fetchReplyData(crowdId, qnaId);
      setSelectedQnaId(qnaId);
    }
  };

  useEffect(() => {
    fetchData();
    // fetchIsCrowdUser();
  }, [crowdId, currentPage]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/crowd/${crowdId}/qna/all?page=${currentPage}`
      );
      if (response.ok) {
        const data = await response.json();
  
        for (const crowdQna of data) {
          const userNickname = await getUserNickname(crowdQna.userId);
          crowdQna.userNickname = userNickname;
        }
        setCrowdQnaList(data);
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching crowd data:", error);
    }
  };  

  // const fetchIsCrowdUser = async (crowdQna) => {
  //   try {
  //     //추가: 현재 로그인한 사용자의 userId와 글을 작성한 사용자의 userId 비교
  //     if (userId === crowdQna.userId) {
  //       crowdQna.isCurrentUserAuthor = true; // 현재 로그인한 사용자가 글 작성자인 경우 표시
  //     } else {
  //       crowdQna.isCurrentUserAuthor = false; // 아닌 경우 표시
  //     }
  //     const response = await fetch(`/crowd/${crowdId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setIsCrowdUser(data);
  //     } else {
  //       throw new Error(`Fetching and data failed with status ${response.status}.`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  useEffect(() => {
    const fetchDataCrowdReplyData = async () => {
      try {
        const response = await fetch(
          `/crowd/${crowdId}/qna/all?page=${currentPage}`
        );
        if (response.ok) {
          const data = await response.json();
          setCrowdQnaList(data);

          data.forEach((crowdQna) => {
            fetchReplyStatusData(crowdId, crowdQna.crowdQnaId);
          });
        } else {
          throw new Error(`Fetching crowd data failed with status ${response.status}.`);
        }
      } catch (error) {
        console.error("Error fetching crowd data:", error);
      }
    };
    fetchDataCrowdReplyData();
  }, [crowdId, currentPage]);

  useEffect(() => { // 전체 페이지 수 카운트
    const fetchCount = async () => {
      try {
        const response = await fetch(`/crowd/${crowdId}/qna/all/count`);
        const data = await response.json();
        setPageCount(Math.ceil(data / 5));
      } catch (error) {
        console.error("Error fetching page count:", error);
      }
    };
    fetchCount();
  }, [crowdId]);

  const fetchReplyData = async (crowdId, crowdQnaId) => {
    try {
      const qnaReplyResponse = await fetch(
        `/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
      if (qnaReplyResponse.ok) {
        const qnaReplyData = await qnaReplyResponse.json();
  
        for (const qnaReplyId in qnaReplyData) {
          const comment = qnaReplyData[qnaReplyId];
          const userNickname = await getUserNickname(comment.userId);
          comment.userNickname = userNickname;
        }
          // // 추가: 현재 로그인한 사용자의 userId와 글을 작성한 사용자의 userId 비교
          // if (userId === comment.userId) {
          //   comment.isCurrentUserAuthor = true; // 현재 로그인한 사용자가 댓글 작성자인 경우 표시
          // } else {
          //   comment.isCurrentUserAuthor = false; // 아닌 경우 표시
          // }

        setCrowdReplyList(qnaReplyData);
      } else {
        throw new Error(`Fetching crowd data failed with status ${qnaReplyResponse.status}.`);
      }
    } catch (error) {
      console.error("Error fetching crowd data:", error);
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQnaReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyFormData({
      ...replyFormData,
      [name]: value,
    });
  };

  const handleQnaInputChange = (e) => {
    const { name, value } = e.target;
    setQnaFormData({
      ...qnaFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (crowdQnaId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      crowdQnaId: crowdQnaId,
    }));
  
    const updatedFormData = {
      ...formData,
      crowdQnaId: crowdQnaId,
    };

    const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    });
    
    if(response.ok) {
      fetchReplyData(crowdId, crowdQnaId);

      setFormData((prevFormData) => ({
        ...prevFormData,
        qnaReplyContent: "",
      }));

      // 해당 질문의 상태를 업데이트
      fetchReplyStatusData(crowdId, crowdQnaId);
    }

    //댓글을 작성하는 나머지 로직
    // const handleQnaReplySubmit = async (e) => {
    //   e.preventDefault();
    //   console.log("formdata:", formData);
    //   const replyResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(updatedFormData),
    //   });
    // }
  };

  const handleUpdateQnaReply = async (crowdId, crowdQnaId, qnaReplyId) => {
    console.log(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`);

    setReplyFormData((prevFormData) => ({
      ...prevFormData,
      crowdQnaId: crowdQnaId,
      qnaReplyId: qnaReplyId,
    }));

    const updatedFormData = {
      ...replyFormData,
      crowdQnaId: crowdQnaId,
      qnaReplyId: qnaReplyId,
    };

    console.log("수정된 폼 데이터:", updatedFormData);

    const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    });

    if (response.ok) {
      fetchReplyData(crowdId, crowdQnaId, qnaReplyId);

      setReplyFormData((prevFormData) => ({
        ...prevFormData,
        qnaReplyContent: "",
      }));

      fetchReplyStatusData(crowdId, crowdQnaId, qnaReplyId);
      handleCloseReplyModal();
    }
  };

  const deleteCrowdQna = async (crowdId, crowdQnaId) => {
    try {
        // QnA 글 삭제
        const response = await axios.delete(`/crowd/${crowdId}/qna/${crowdQnaId}/delete`);
        if (response.status === 200) {
          fetchData();
          navigate(`/crowd/${crowdId}/qna/all`);
        }

    } catch (error) {
        console.error("error in deleting crowd:", error);
    }
  };

  const handleUpdateQna = async (crowdId, crowdQnaId) => {
    try {
      const response = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qnaFormData),
      });
      if (response.status === 200) {
        console.log("게시물이 수정되었습니다.");
        handleCloseModal();
        fetchData();
      }
    } catch (error) {
      console.error("error in deleting crowd:", error);
    }
  };

  const deleteCrowdReply = async (crowdId, crowdQnaId, qnaReplyId) => {
    try {
      await axios.delete(
        `/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}/delete`
      );
      console.log("Deleted crowd with ID:", crowdQnaId);
      fetchReplyData(crowdId, crowdQnaId);
      fetchReplyStatusData(crowdId, crowdQnaId);
      alert("답변이 삭제되었습니다.");
      navigate(`/crowd/${crowdId}/qna/all`);
    } catch (error) {
      console.error("error in deleting crowd:", error);
    }
  };

  const createQna = (crowdId) => {
    navigate(`/crowd/${crowdId}/qna`);
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "";
  
    const dateObject = new Date(dateTimeString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
  
    const formattedString = `${year}-${month}-${day}`;
  
    return formattedString;
  };

  return (
    <div id="qna-container">
      <CrowdToolBar crowdId={crowdId} />
      <div id="qna-box">
        <div className="title">
          <h3>Q&A</h3>
        </div>
        <div className="create">
          <Button onClick={() => createQna(crowdId)} variant="outlined" color="success">
            문의 글 작성
          </Button>
        </div>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">답변상태</TableCell>
                <TableCell align="center">제목</TableCell>
                <TableCell align="center">작성자</TableCell>
                <TableCell align="center">작성일</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {crowdQnaList.map((crowdQna) => (
                <>
                  <TableRow hover style={{ height: 50 }}>
                    {/* 답변 상태 확인 컬럼 */}
                    <TableCell align="center" sx={{ width: "10%", borderBottom: "none" }}>
                      {qnaReplyData[crowdQna.crowdQnaId]?.length > 0 ? (<p>답변완료</p>) : (<p>미답변</p>)}
                    </TableCell>
                    {/* qna 제목 */}
                    <TableCell align="center" onClick={() => handleQnaClick(crowdQna.crowdQnaId)}
                      sx={{cursor: "pointer", width: "50%", borderBottom: "none"}}>
                      {crowdQna.qnaTitle}
                    </TableCell>
                    {/* 작성자 */}
                    <TableCell align="center" sx={{ width: "15%", borderBottom: "none" }}>
                      {crowdQna.userNickname}
                    </TableCell>
                    {/* 작성일 */}
                    <TableCell align="center" sx={{ width: "15%", borderBottom: "none" }}>
                      {formatDate(crowdQna.updatedAt)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ padding: 0, borderBottom: "none" }} colSpan={4}>
                      <Collapse in={selectedQnaId === crowdQna.crowdQnaId} timeout="auto" unmountOnExit>
                        <Box sx={{ padding: 2, background: "#f6f8f6" }}>
                          <Table size="small" aria-label="CrowdQnaReply">
                            <TableBody>
                              {selectedQnaId === crowdQna.crowdQnaId && (
                                <>
                                  <TableRow>
                                    <TableCell colSpan={4} sx={{padding: 2, paddingLeft: 8, borderBottom: "none", borderTop: "none"}}>
                                      {crowdQna.qnaContent}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell align="right" colSpan={4} sx={{ padding: 2, paddingBottom: 4, paddingRight: 5}}>
                                      {/* qna 작성자만 수정/삭제 가능 */}
                                      {userId === crowdQna.userId && (
                                        <>
                                          <Button size="small" sx={{ minWidth: "40px" }}
                                            onClick={() => {handleOpenModal(crowdId, crowdQna.crowdQnaId);
                                            }}>
                                            수정
                                          </Button>
                                          <Button size="small" color="error" sx={{ minWidth: "40px" }}
                                            onClick={() => deleteCrowdQna(crowdId, crowdQna.crowdQnaId)}>
                                            삭제
                                          </Button>

                                          <Modal
                                            open={openModal}
                                            onClose={handleCloseModal}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                          >
                                            <Box sx={style}>
                                              <Typography id="modal-modal-title" variant="h6" component="h2">
                                                <TextField fullWidth id="outlined-basic" label="문의 제목" variant="outlined" size="small" sx={{ mt: 1 }}
                                                  type="text" name="qnaTitle" value={qnaFormData.qnaTitle}
                                                  onChange={handleQnaInputChange}/>
                                              </Typography>
                                              <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
                                                <TextField fullWidth multiline rows={3} id="outlined-basic" label="문의 내용" variant="outlined" margin="normal" size="small"
                                                  type="text" name="qnaContent" value={qnaFormData.qnaContent}
                                                  onChange={handleQnaInputChange}/>
                                                </Typography>
                                              <Button onClick={() => {handleUpdateQna(crowdId, crowdQna.crowdQnaId);}}>수정</Button>
                                            </Box>
                                          </Modal>
                                        </>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                              {selectedQnaId === crowdQna.crowdQnaId && (
                                <>
                                  {Object.keys(crowdReplyList).length > 0 ? (
                                    Object.keys(crowdReplyList).map((replyId) => {
                                        const comment = crowdReplyList[replyId];
                                        return (
                                          <React.Fragment key={comment.qnaReplyId}>
                                            <TableRow>
                                              <TableCell align="right" sx={{width: "10%", paddingBottom: 2, paddingTop: 2}}> <SubdirectoryArrowRightRounded color="action"/></TableCell>
                                              <TableCell sx={{width: "45%", paddingBottom: 2, paddingTop: 2}}>
                                                {comment.qnaReplyContent}

                                                {/* 해당 답변 작성자만 수정/삭제 가능 */}
                                                {userId === crowdQna.userId && (
                                                  <>
                                                  <Button size="small" sx={{minWidth: "40px", ml: 2}}
                                                    onClick={() => {handleOpenReplyModal(crowdId, crowdQna.crowdQnaId, comment.qnaReplyId);
                                                    }}>수정</Button>
                                                  <Button size="small" color="error" sx={{minWidth: "40px"}}
                                                    onClick={() => deleteCrowdReply(crowdQna.crowdQnaId, comment.qnaReplyId)}>삭제</Button>

                                                  <Modal
                                                    open={openReplyModal}
                                                    onClose={handleCloseReplyModal}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                  >
                                                    <Box sx={style}>
                                                      <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
                                                        <TextField fullWidth multiline rows={3} id="outlined-basic" label="답변 내용" variant="outlined" margin="normal" size="small"
                                                          type="text" name="qnaReplyContent" value={replyFormData.qnaReplyContent}
                                                          onChange={handleQnaReplyInputChange}/>
                                                      </Typography>
                                                      <Button onClick={() => {handleUpdateQnaReply(crowdQna.crowdQnaId, comment.qnaReplyId);}}>수정</Button>
                                                    </Box>
                                                  </Modal>
                                                </>
                                                )}
                                              </TableCell>
                                              <TableCell sx={{width: "15%",paddingBottom: 2,paddingTop: 2,}}>{comment.userNickname}</TableCell>
                                              <TableCell sx={{width: "15%",paddingBottom: 2,paddingTop: 2,}}>{formatDate(comment.updatedAt)}</TableCell>
                                            </TableRow>
                                          </React.Fragment>
                                        );
                                      }
                                    )
                                  ) : (
                                    <TableRow>
                                      {/* <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10 }} >
                                        답변이 없습니다.
                                      </TableCell>
                                      <TableCell /> */}
                                    </TableRow>
                                  )}
                                  {/* 관리자인 경우에만 qna 댓글 작성 가능 */}
                                  { isAdmin && (
                                    <TableRow>
                                    <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10, paddingBottom: 0, paddingTop: 3, borderBottom: "none" }}>
                                      <TextField
                                        fullWidth
                                        id="standard-multiline-static"
                                        multiline
                                        rows={1}
                                        variant="standard"
                                        color="success"
                                        name="qnaReplyContent"
                                        onChange={handleInputChange}
                                        value={formData.qnaReplyContent}
                                      />
                                    </TableCell>

                                    {/* 저장 버튼 */}
                                    <TableCell sx={{ borderBottom: "none", paddingTop: 2 }}>
                                      <Button color="success" onClick={() => handleSubmit(crowdQna.crowdQnaId)}>
                                        저장
                                      </Button>
                                    </TableCell> 
                                  </TableRow>   
                                  )}
                                </>
                              )}
                            </TableBody>
                          </Table>
                          
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
          </TableContainer>

          <MyPaginate
            pageCount={pageCount}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousLabel="< "
            nextLabel=" >"  
            pageRangeDisplayed={5}
            marginPagesDisplayed={0}
            breakLabel="..."
            renderOnZeroPageCount={null}
          />
      </div>
    </div>
  );
};

export default CrowdQnaList;
