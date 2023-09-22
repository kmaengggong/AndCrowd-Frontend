import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AndToolBar from "../../components/and/AndToolBar";
import '../../styles/and/AndQna.css'
import ReactPaginate from 'react-paginate';
import { Modal, Button, TextField, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from "@mui/material";
import { GetUserId } from '../../components/user/GetUserId';
import { getUserNickname } from "../../components/and/userApi";
import axios from "axios";
import styled from 'styled-components';
import SubdirectoryArrowRightRoundedIcon from '@mui/icons-material/SubdirectoryArrowRightRounded';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
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

const AndQna = (props) => {
  const navigate = useNavigate();

  const params = useParams();
  const andId = params.andId;
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [andQnaList, setAndQnaList] = useState([]);
  const [selectedQnaId, setSelectedQnaId] = useState(null);
  const [andReplyList, setAndReplyList] = useState({});
  const { row } = props;
  const [openQna, setOpenQna] = useState(false);
  const [qnaReplyData, setQnaReplyData] = useState({});
  const [isMember, setIsMember] = useState(false); // 멤버 여부

  const userId = GetUserId(); // 현재 로그인 중인 사용자 id
  
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = (andId, andQnaId) => {
    fetchQnaData(andId, andQnaId);
    setOpenModal(true);
  };

  const [openReplyModal, setOpenReplyModal] = useState(false);
  const handleCloseReplyModal = () => setOpenReplyModal(false);
  const handleOpenReplyModal = (andId, andQnaId, andQnaReplyId) => {
    fetchQnaReplyData(andId, andQnaReplyId);
    setOpenReplyModal(true);
  };

  const [formData, setFormData] = useState({
    andId: andId,
    userId: userId,
    andReplyContent: "",
    andQnaId: '',
});

  const [qnaFormData, setQnaFormData] = useState({
    andId: andId,
    andQnaId: '',
    userId: userId,
    andQnaTitle: "",
    andQnaContent: "",
  });

  const [replyFormData, setReplyFormData] = useState({
    andId: andId,
    andQnaId: '',
    andQnaReplyId: '',
    userId: userId,
    andReplyContent: "",
    });


  const fetchQnaReplyData = async (andId, andQnaReplyId) => {
    try {
      const response = await fetch(`/and/${andId}/qna/reply/${andQnaReplyId}`);
      
      if (response.ok) {
        const data = await response.json();
        setReplyFormData(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And Qna data:", error);
    }
  };


  const fetchQnaData = async (andId, andQnaId) => {
    try {
      const response = await fetch(`/and/${andId}/qna/${andQnaId}`);
      
      if (response.ok) {
        const data = await response.json();
        setQnaFormData(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And Qna data:", error);
    }
  };

  const fetchReplyStatusData = async (andId, andQnaId) => {
    try {
      const qnaReplyResponse = await fetch(`/and/${andId}/qna/reply/${andQnaId}/all`);
      if (qnaReplyResponse.ok) {
        const qnaReplyData = await qnaReplyResponse.json();

        setQnaReplyData((prevData) => ({
          ...prevData,
          [andQnaId]: qnaReplyData,
        }));
      } else {
        throw new Error(`Fetching and data failed with status ${qnaReplyResponse.status}.`);
      }
    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const handleQnaClick = (qnaId) => {
    setOpenQna(!openQna);
    if (selectedQnaId === qnaId) {
      fetchReplyData(andId, qnaId)
      setSelectedQnaId(null);
    } else {
      fetchReplyData(andId, qnaId)
      setSelectedQnaId(qnaId);
    }
  };

  useEffect(() => {
    fetchData();
    fetchIsMember();
  }, [andId, currentPage]);


  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/qna/list?page=${currentPage}`);
      
      if (response.ok) {
        const data = await response.json();

        // 작성자 닉네임을 가져와서 각 질문의 작성자 컬럼을 업데이트
        for (const andQna of data) {
          const userNickname = await getUserNickname(andQna.userId);
          andQna.userNickname = userNickname;
        }

        setAndQnaList(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const fetchIsMember = async () =>{
    try {
      console.log(`/and/${andId}/check-member/${userId}`)
      const response = await fetch(`/and/${andId}/check-member/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsMember(data);
        console.log(data)
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }


  useEffect(() => {
    const fetchDataAndReplyData = async () => {
      try {
        const response = await fetch(`/and/${andId}/qna/list?page=${currentPage}`);
        
        if (response.ok) {
          const data = await response.json();
          setAndQnaList(data);
          
          // fetchData()가 완료되고 andQnaList가 업데이트된 이후에 fetchReplyStatusData() 호출
          data.forEach((andQna) => {
            fetchReplyStatusData(andId, andQna.andQnaId); // 각 질문에 대한 댓글 데이터를 가져오는 함수
          });
        } else {
          throw new Error(`Fetching and data failed with status ${response.status}.`);
        }
      } catch (error) {
        console.error("Error fetching And data:", error);
      }
    };
  
    fetchDataAndReplyData();
  }, [andId, currentPage]);
  

  // 전체 페이지 수
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`/and/${andId}/qna/list/count`);
        const data = await response.json();
        setPageCount(Math.ceil(data / 7));
      } catch (error) {
        console.error("Error fetching page count:", error);
      }
    };
    
    fetchCount();
  }, [andId]);

  const fetchReplyData = async (andId, andQnaId) => {
    try {
      const qnaReplyResponse = await fetch(`/and/${andId}/qna/reply/${andQnaId}/all`);
      if (qnaReplyResponse.ok) {
        const qnaReplyData = await qnaReplyResponse.json();

        // 답변 작성자 닉네임을 가져와서 각 답변의 작성자 컬럼을 업데이트
        for (const replyId in qnaReplyData) {
          const comment = qnaReplyData[replyId];
          const userNickname = await getUserNickname(comment.userId);
          comment.userNickname = userNickname;
        }

        setAndReplyList(qnaReplyData);
      } else {
        throw new Error(`Fetching and data failed with status ${qnaReplyResponse.status}.`);
    }
    } catch (error) {
      console.error("Error fetching And data:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const handleQnaReplyInputChange = (event) => {
    const { name, value } = event.target;
    setReplyFormData({
      ...replyFormData,
      [name]: value,
    });
  };

  const handleQnaInputChange = (event) => {
    const { name, value } = event.target;
    setQnaFormData({
      ...qnaFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (andQnaId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      andQnaId: andQnaId,
    }));
    
    const updatedFormData = {
      ...formData,
      andQnaId: andQnaId,
    };
  
    const response = await fetch(`/and/${andId}/qna/reply/${andQnaId}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    });
  
    if (response.ok) {
      // 저장 성공 시 댓글 데이터 다시 로드
      fetchReplyData(andId, andQnaId);
      
      // 입력 필드 초기화
      setFormData((prevFormData) => ({
        ...prevFormData,
        andReplyContent: "",
      }));

      // 해당 질문의 상태를 업데이트
      fetchReplyStatusData(andId, andQnaId);
    }
  };

  const handleUpdateQnaReply = async (andQnaId, andQnaReplyId) => {

    console.log(`/and/${andId}/qna/reply/${andQnaId}/${andQnaReplyId}/update`);

    setReplyFormData((prevFormData) => ({
      ...prevFormData,
      andQnaId: andQnaId,
      andQnaReplyId: andQnaReplyId,
    }));
    
    const updatedFormData = {
      ...replyFormData,
      andQnaId: andQnaId,
      andQnaReplyId: andQnaReplyId,
    };


    console.log("updatedFormData:", updatedFormData); // 전달 값 확인

    const response = await fetch(`/and/${andId}/qna/reply/${andQnaId}/${andQnaReplyId}/update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
    });

    if (response.ok) {
      // 저장 성공 시 댓글 데이터 다시 로드
      fetchReplyData(andId, andQnaId);
      
      // 입력 필드 초기화
      setReplyFormData((prevFormData) => ({
        ...prevFormData,
        andReplyContent: "",
      }));

      // 해당 질문의 상태를 업데이트
      fetchReplyStatusData(andId, andQnaId);

      handleCloseReplyModal();

    }
    
};


  const deleteAndQna = async (andId, andQnaId) => {
    const isConfirmed = window.confirm("정말로 문의글을 삭제하시겠습니까?");
    if (isConfirmed) {
    try {
      const response = await axios.delete(`/and/${andId}/qna/${andQnaId}/delete`);
      if (response.status === 200) { 
        fetchData(); 
      }
    } catch (error) {
      console.error("error in deleting and:", error);
    }
  } else {
    console.log("문의글 삭제가 취소되었습니다.");
  }
  };

  const handleUpdateQna = async (andId, andQnaId) => {

    try {

      const response = await fetch(`/and/${andId}/qna/${andQnaId}/update`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(qnaFormData),
      });
      if (response.status === 200) { 
        console.log('업데이트됨')
        handleCloseModal();
        fetchData(); 
      }
    } catch (error) {
      console.error("error in deleting and:", error);
    }

};

const deleteAndReply = async (andId, andQnaId, andReplyId) => {
  const isConfirmed = window.confirm("정말로 답변을 삭제하시겠습니까?");
  if (isConfirmed) {
  try {
    await axios.delete(`/and/${andId}/qna/reply/${andQnaId}/${andReplyId}/delete`);
    console.log("Deleted and with ID:", andQnaId);
    fetchReplyData(andId, andQnaId);
    fetchReplyStatusData(andId, andQnaId);
  } catch (error) {
    console.error("error in deleting and:", error);
  }
  } else {
    console.log("답변 삭제가 취소되었습니다.");
  }
};


const createQna = (andId) => {
  navigate(`/and/${andId}/qna/create`);
}

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
    <div id='qna-container'>
      <AndToolBar andId={andId} />
      <div id='qna-box'>
      <div className="title">
        <h2>Q&A</h2>
      </div>
      <div className="create">
        <Button onClick={() => createQna(andId)}
        variant="outlined" color="success">
          문의글 작성
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
            {andQnaList.map((andQna) => (
              <>
                <TableRow hover key={andQna.andQnaId} style={{ height: 50 }}>
                  {/* 답변 상태 */}
                  <TableCell align="center" sx={{ width: '10%', borderBottom:"none" }} >
                    {qnaReplyData[andQna.andQnaId]?.length > 0 ? (<p>답변완료</p>) : (<p>미답변</p>)}
                  </TableCell>
                  {/* 제목 */}
                  <TableCell onClick={() => handleQnaClick(andQna.andQnaId)}
                    sx={{ cursor: 'pointer', width: '50%', borderBottom:"none" }}
                  >{andQna.andQnaTitle}</TableCell>
                  {/* 작성자 */}
                  <TableCell align="center" sx={{ width: '15%', borderBottom:"none" }}>{andQna.userNickname}</TableCell>
                  {/* 작성일 */}
                  <TableCell align="center" sx={{ width: '15%', borderBottom:"none" }}>{formatDate(andQna.updatedAt)}</TableCell>
                </TableRow>

                <TableRow> 
                  <TableCell style={{ padding: 0, borderBottom:"none" }} colSpan={4}>
                    <Collapse in={selectedQnaId === andQna.andQnaId} timeout="auto" unmountOnExit>
                      <Box sx={{ padding: 2, background: '#f6f8f6' }}>
                        <Table size="small" aria-label="AndQnaReply">
                          <TableBody>
                            {selectedQnaId === andQna.andQnaId && (
                              <>
                              <TableRow>
                                <TableCell colSpan={4} sx={{ padding: 2, paddingLeft: 8, borderBottom: 'none', borderTop: 'none' }} >
                                  {andQna.andQnaContent}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align="right" colSpan={4} sx={{ padding: 2, paddingBottom: 4, paddingRight: 5 }}>
                                  {/* 질문 작성자만 수정/삭제 가능 */}
                                  { userId === andQna.userId && (
                                  <>
                                  <Button size="small" sx={{ minWidth: '40px' }}
                                    onClick={() =>{ handleOpenModal(andId, andQna.andQnaId); 
                                    }}
                                  >수정</Button> 
                                  <Button size="small" color="error" sx={{ minWidth: '40px' }} 
                                  onClick={() => deleteAndQna(andId, andQna.andQnaId)}>삭제</Button>

                                  <Modal
                                    open={openModal}
                                    onClose={handleCloseModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography id="modal-modal-title" variant="h6" component="h2">
                                        <TextField fullWidth id="outlined-basic" label="문의 제목" variant="outlined" size="small" sx={{ mt: 1 }}
                                         type="text" name="andQnaTitle" value={qnaFormData.andQnaTitle} 
                                         onChange={handleQnaInputChange} />
                                      </Typography>
                                      <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
                                        <TextField fullWidth multiline rows={3} id="outlined-basic" label="문의 내용" variant="outlined" margin="normal" size="small" 
                                        type="text" name="andQnaContent" value={qnaFormData.andQnaContent} 
                                        onChange={handleQnaInputChange}/>
                                      </Typography>
                                      <Button onClick={() =>{ handleUpdateQna(andId, andQna.andQnaId); }}>수정</Button>
                                    </Box>
                                  </Modal>
                                  </>
                                  )}
                                </TableCell>
                              </TableRow>
                              </>
                            )}
                              {selectedQnaId === andQna.andQnaId && (
                              <>
                                {Object.keys(andReplyList).length > 0 ? (
                                  Object.keys(andReplyList).map((replyId) => {
                                    const comment = andReplyList[replyId];
                                    return (
                                      <React.Fragment key={comment.andReplyId}>
                                        <TableRow >
                                          <TableCell align="right" sx={{ width: '10%', paddingBottom: 2, paddingTop: 2 }} > <SubdirectoryArrowRightRoundedIcon color="action"/> </TableCell>
                                          <TableCell sx={{ width: '45%', paddingBottom: 2, paddingTop: 2 }}>
                                            {comment.andReplyContent}

                                            {/* 해당 답변 작성자만 수정/삭제 가능 */}
                                            { userId === comment.userId && (
                                            <>
                                              <Button size="small" sx={{ minWidth: '40px', ml: 2 }}
                                                onClick={() =>{ handleOpenReplyModal(andId, andQna.andQnaId, comment.andReplyId); 
                                                }}
                                              >수정</Button> 
                                              <Button size="small" color="error" sx={{ minWidth: '40px' }} 
                                              onClick={() => deleteAndReply(andId, andQna.andQnaId, comment.andReplyId)}>삭제</Button>

                                              <Modal
                                                open={openReplyModal}
                                                onClose={handleCloseReplyModal}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                              >
                                                <Box sx={style}>
                                                  <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
                                                    <TextField fullWidth multiline rows={3} id="outlined-basic" label="답변 내용" variant="outlined" margin="normal" size="small" 
                                                    type="text" name="andReplyContent" value={replyFormData.andReplyContent} 
                                                    onChange={handleQnaReplyInputChange}/>
                                                  </Typography>
                                                  <Button onClick={() =>{ handleUpdateQnaReply(andQna.andQnaId, comment.andReplyId); }}>수정</Button>
                                                </Box>
                                              </Modal>
                                            </>
                                          )}
                                          </TableCell>
                                          <TableCell align="center" sx={{ width: '10%',  paddingBottom: 2, paddingTop: 2 }}>{comment.userNickname}</TableCell>
                                          <TableCell align="center" sx={{ width: '10%',  paddingBottom: 2, paddingTop: 2 }}>{formatDate(comment.updatedAt)}</TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    );
                                  })
                                ) : (
                                  <TableRow>
                                    {/* <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10 }} >
                                      답변이 없습니다.
                                    </TableCell>
                                    <TableCell /> */}
                                  </TableRow>
                                )}
                                {/* 멤버인 경우에만 답변 작성 가능 */}
                                { isMember && (
                                  <TableRow>
                                    <TableCell colSpan={3} sx={{ padding: 2, paddingLeft: 10, paddingBottom: 0, paddingTop: 3, borderBottom: "none" }}>
                                      <TextField
                                        fullWidth
                                        id="standard-multiline-static"
                                        multiline
                                        rows={1}
                                        variant="standard"
                                        color="success"
                                        name="andReplyContent"
                                        onChange={handleInputChange}
                                        value={formData.andReplyContent}
                                      />
                                    </TableCell>

                                    {/* 저장 버튼 */}
                                    <TableCell sx={{ borderBottom: "none", paddingTop: 2 }}>
                                      <Button color="success" onClick={() => handleSubmit(andQna.andQnaId)}>
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
}
      
export default AndQna;