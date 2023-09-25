import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../styles/and/Chatroom.css';
import { IconButton, Avatar, Typography, Modal, Box, TextField, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { GetUserInfo } from "../../components/user/GetUserInfo";
import { GetUserId } from "../../components/user/GetUserId";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

function formatTimestamp(timestamp) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return new Date(timestamp).toLocaleString('ko-KR', options);
}

function isImageFile(fileName) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const extension = getFileExtension(fileName);
  return imageExtensions.includes(extension);
}

function getFileExtension(fileName) {
  return fileName.split('.').pop();
}

const ChatRoom = ({ roomData, nickname, andId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [connectedList, setConnectedList] = useState([]);
  const [tab, setTab] = useState('CHATROOM');
  const [privateChats, setPrivateChats] = useState({}); 
  const [previousPrivateMessages, setPreviousPrivateMessages] = useState([]); 
  const [userProfileImg, SetUserProfileImg] = useState('');
  const [userInfo, setUserInfo] = useState([]);

  const navigate = useNavigate();

  const messagesContainerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newName, setNewName] = useState('');

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameUpdate = async () => {
    if (newName.trim() !== "") {
      try {
        const response = await fetch(`/and/${andId}/chat/room/${roomData.roomId}/name-update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/plain', // Content-Type을 text/plain으로 설정
          },
          body: newName, // 일반 문자열로 데이터 보내기
        });
  
        if (response.ok) {
          setOpen(false);
          roomData.name = newName;
        } else {
          console.error('Failed to update chat room name:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating chat room name:', error);
      } finally {
      }
      navigate(`/and/${andId}/chat`);
    }
  };
  
  useEffect(() => {
    const userId = GetUserId();
    GetUserInfo(userId, setUserInfo);
  }, []);

  // 스크롤을 항상 가장 아래로 이동시키는 함수
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // messages가 업데이트될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages, privateChats]);

  useEffect(() => {
    const socket = new SockJS('http://223.130.128.246/ws');
    const stomp = Stomp.over(socket);

    const handleBeforeUnload = () => {
      if (stomp) {
        const leaveMessage = {
          senderName: nickname,
          roomId: roomData.roomId,
          chatStatus: 'LEAVE',
        };
        stomp.send('/app/chat/out', {}, JSON.stringify(leaveMessage));
        stomp.disconnect();
      }
    };

    stomp.connect({}, () => {
      stomp.subscribe(`/sub/chat/room/${roomData.roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        
        if(newMessage.chatStatus !== "MESSAGE"){
          setConnectedList(newMessage.userList);}
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      stomp.subscribe('/user/'+nickname+'/private', onPrivateMessage);

      const joinMessage = {
        senderName: nickname,
        roomId: roomData.roomId,
        chatStatus: 'JOIN',
      };
      stomp.send('/app/chat/enter', {}, JSON.stringify(joinMessage));

      setStompClient(stomp);

      loadPreviousMessages(roomData.roomId);
      loadPreviousPrivateMessages(roomData.roomId, nickname, tab);
      loadChatMembers(roomData.roomId);

      // beforeunload 이벤트 핸들러 등록
      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    return () => {
      if (stomp.connected) {
        const leaveMessage = {
          senderName: nickname,
          roomId: roomData.roomId,
          chatStatus: 'LEAVE',
        };
        stomp.send('/app/chat/out', {}, JSON.stringify(leaveMessage));

        stomp.disconnect();
      }
      setMessages([]);
      // beforeunload 이벤트 핸들러 해제
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomData.roomId, nickname]);

  const loadPreviousMessages = async () => {
    try {
      const response = await fetch(`/and/message/${roomData.roomId}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousMessages(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading previous messages:', error);
    }
  };

  const loadPreviousPrivateMessages = async () => {
    try {
      const response = await fetch(`/and/message/${roomData.roomId}/private/${nickname}/${tab}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousPrivateMessages(data);

        // console.log(roomData.roomId);
        // console.log(nickname);
        // console.log(tab);
        // console.log(data);

      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading previous messages:', error);
    }

  };

  const loadChatMembers = async (roomId) => {
    try {
      const response = await fetch(`/and/${andId}/chat/${roomId}/member`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
        console.log("loadChatMembers data: ", data)
      } else {
        throw new Error(`Fetching chat members failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading chat members:', error);
    }
  };

  const getUserImg = async (name) => {
    try {
      const response = await fetch(`/and/chat/${name}/img`);
      if (response.ok) {
        const clonedResponse = response.clone();
        const imageUrl = await clonedResponse.text();
        SetUserProfileImg(imageUrl);
        userProfileImg = imageUrl;
      } else {
        throw new Error(`Fetching failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading :', error);
    }
}

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
  
    setPrivateChats((prevPrivateChats) => {
      const updatedChats = { ...prevPrivateChats };
  
      if (updatedChats[payloadData.senderName]) {
        updatedChats[payloadData.senderName].push(payloadData);
      } else {
        updatedChats[payloadData.senderName] = [payloadData];
      }
  
      return updatedChats;
    });
  };
  
  const handleSendMessage = () => {
    if (stompClient && message.trim() !== '') {
      const chatMessage = {
        senderName: nickname,
        message: message,
        roomId: roomData.roomId,
        chatStatus: "MESSAGE",
      };
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  const handleSendPrivateMessage = () => {
    if (stompClient && message.trim() !== '') {
      const chatMessage = {
        senderName: nickname,
        receiverName: tab,
        message: message,
        roomId: roomData.roomId,
        chatStatus:"MESSAGE",
        publishedAt: new Date().toISOString() // 현재 시간 설정
      };
      
      if (nickname !== tab) {
        const updatedChatMessages = [...(privateChats[tab] || []), chatMessage];
        setPrivateChats((prevPrivateChats) => ({ ...prevPrivateChats, [tab]: updatedChatMessages }));
      }
  
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  }
  
  const updateChatroom = () => {
    navigate(`/and/${andId}/chat/room/${roomData.roomId}/name-update`);
  };


  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('roomId', roomData.roomId);

    try {
      const response = await fetch('/s3/upload', {
        method: 'POST',
        body: formData,
        headers: {
          ACL: 'public-read',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const chatMessage = {
          roomId: roomData.roomId,
          senderName: nickname,
          message: `${nickname}님의 파일 업로드`,
          chatStatus: 'MESSAGE',
          s3DataUrl: data.s3DataUrl,
          fileName: selectedFile.name,
          fileDir: data.fileDir,
        };

        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      } else {
        throw new Error(`File upload failed with status ${response.status}.`);
      }
    } catch (error) {
      alert(error);
    }
  };

  function downloadFile(name, dir) {
    const url = `/s3/download/${name}?fileDir=${dir}`;

    fetch(url, {
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'application/octet-stream',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = name;
        downloadLink.click();
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
        alert('Error downloading file.');
      });
  }

  const handleMemberClick = (name) => {
    console.log("handleMemberClick: ", name);
    setTab(name);
    getUserImg(name);
  };
  
  const handleChatRoomClick = () => {
    setTab('CHATROOM');
  };


  useEffect(() => {
    loadPreviousPrivateMessages(roomData.roomId, nickname, tab);
    
  }, [tab, roomData.roomId, nickname]);

  const onKeyEnterDown = (event) => {
    if(event.key === 'Enter'){
      handleSendMessage();
    }
  }

  return (
    <div className='chatroom-container'>

      <div className='chatroom-left'>
        {/* 채팅방 이름 조회 및 출력 */}
        <div className='chatroom-group'>
          <Avatar sx={{ background: "#1ac948", mt:2, ml:1, width:37, height:37 }}><span id='bold'>&</span></Avatar>
          <p
            id='and-name'
            onClick={handleChatRoomClick}
            className={`member ${tab === 'CHATROOM' && 'active'}`}
          >          {roomData.name}
          </p>
          <div id='edit-icon'>
          <IconButton aria-label="edit" size="small" onClick={() => handleOpen(roomData.roomId)}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                채팅방 이름 수정
              </Typography>
              <TextField
                id="standard-helperText"
                placeholder={roomData.name}
                variant="standard"
                value={newName}
                onChange={handleNameChange}
                sx={{ mt:2, mr:2 }}
              />
              <Button variant="저장" sx={{ mt:1 }} onClick={handleNameUpdate} >저장</Button>
            </Box>
          </Modal>
          </div>
        </div>

        {/* 모임 참여자 목록 */}
        <div className='chatroom-member'>
          {/* <span>Chat Members: 닉네임(이름)</span> */}
          {members.map((member, index) => (
            <div 
              id='member-list'
              key={index} 
              onClick={() => handleMemberClick(member.userNickname)}
              className={`member ${tab===member.userNickname && "active"}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mt:1, ml:1, width:35, height:36 }} alt="member_img" src={member.userProfileImg} />
                  <p id='member-nickname'>{member.userNickname}</p>
                  {member.userKorName && <p id='member-nickname'>({member.userKorName})</p>}              
                  {connectedList && connectedList.includes(member.userNickname) && (
                    <div id='online'> <FiberManualRecordRoundedIcon sx={{ fontSize: 14, color: "#99f76d" }} /></div>
                  )}
                </div>
            </div>
          ))}
        </div>

        {/* 로그인 유저 */}
        <div className='login-user' style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ background: "#72a4f7", ml:1, width:35, height:36 }} src={userInfo.userProfileImg} ></Avatar>
          <span id='login-nickname'>{nickname} ({userInfo.userKorName})</span>
        </div>

      </div>
        
        {tab==="CHATROOM" &&
        <div className='chatroom-right'>
        <div className='chatroom-name'>
          <div id='chat-title' style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ background: "#1ac948" }}><span id='bold'>&</span></Avatar>
            <Typography variant="subtitle1" sx={{ ml: 1}}>
              <span id='font-name'>{roomData.name}</span>
            </Typography>
          </div>
        </div>
        <div className='chatroom-public' ref={messagesContainerRef}>
          <div>
            {/* DB에 저장된 메세지 출력 */}
            {previousMessages.map((msg, index) => (
              <div key={index} className={msg.senderName === nickname ? 'message-sent' : 'message-received'}>
                {msg.senderName !== nickname && <div id="message-name">{msg.senderName} </div>}

                {/* 시간 출력 */}
                {msg.senderName === nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}

                {msg.s3DataUrl && (
                  <span id='message-file'>
                    {isImageFile(msg.fileName) ? (
                      <span>
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName === nickname && <FileDownloadOutlinedIcon fontSize='small'/>}
                        </IconButton>
                        <img src={msg.s3DataUrl} alt="file" width="100" />
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName !== nickname && <FileDownloadOutlinedIcon fontSize='small'/>}
                        </IconButton>
                      </span>
                    ) : (
                      <span>
                        <IconButton aria-label="filedown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName === nickname && <SimCardDownloadRoundedIcon fontSize='small'/>}
                        </IconButton>

                        {msg.fileName}
                        <IconButton aria-label="filedown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName !== nickname && <SimCardDownloadRoundedIcon fontSize='small'/>}
                        </IconButton>
                      </span>
                    )}
                  </span>
                )}

                {!msg.s3DataUrl && (
                  <span id='message-content'>{msg.message} </span>
                )}

                {/* 시간 출력 */}
                {msg.senderName !== nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}
              </div>
            ))}
            <hr />

          {/* 접속 후의 메세지 출력 */}
          {messages.map((msg, index) => (
            msg.chatStatus === 'MESSAGE' && (
              <div key={index} className={msg.senderName === nickname ? 'message-sent' : 'message-received'}>
                {/* 이름 출력 여부 결정 */}
                {msg.senderName !== nickname && <div id="message-name">{msg.senderName} </div>}
                
                {/* 시간 출력 */}
                {msg.senderName === nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}

                {/* 메시지 내용 */}
                {msg.s3DataUrl ? (
                  <span id="message-file">
                    {isImageFile(msg.fileName) ? (
                      <span>
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName === nickname && <FileDownloadOutlinedIcon fontSize='small'/>}
                        </IconButton>
                        <img src={msg.s3DataUrl} alt="file" width="100" />
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName !== nickname && <FileDownloadOutlinedIcon fontSize='small'/>}
                        </IconButton>
                      </span>
                    ) : (
                      <span>
                        <IconButton aria-label="filedown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName === nickname && <SimCardDownloadRoundedIcon fontSize='small'/>}
                        </IconButton>

                        {msg.fileName}
                        <IconButton aria-label="filedown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName !== nickname && <SimCardDownloadRoundedIcon fontSize='small'/>}
                        </IconButton>
                      </span>
                    )}
                  </span>
                ) : (
                    <span id="message-content">{msg.message}</span>
                )}
                  {msg.senderName !== nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}
              </div>
            )
          ))}
          </div>
        </div>
        <div className='chatroom-send'>
          <div className='chatroom-input'>
            <IconButton component="label" id='send-file-icon' onChange={handleFileChange} >
              <AttachFileRoundedIcon sx={{ fontSize: 25, color: "#709CE6" }} />
              <input hidden type="file" />
            </IconButton>
            <input type="text" id='send-text' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={onKeyEnterDown} />
          </div>
          <IconButton aria-label="send" id='send-message-icon' size="small" onClick={handleSendMessage}>
            <SendRoundedIcon sx={{ fontSize: 25, color: "#5B96F7", ml:2 }} />
          </IconButton>
        </div>
        </div>
        }

        {tab!=="CHATROOM" &&
        <div className='chatroom-right'>
        <div className='chatroom-name' style={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar sx={{ mt:1, ml:1, mb:1, width:40, height:40 }}><PersonRoundedIcon /></Avatar> */}
          <Avatar sx={{ mt:1, ml:1, mb:1, width:40, height:40 }} alt="member_img" src={userProfileImg} />
          <p id='private-name'>{tab}</p>
        </div>
      
          <div className='chatroom-private' ref={messagesContainerRef}>
            {/* DB에 저장된 메세지 출력 */}
            {previousPrivateMessages.map((msg, index) => (
            <div key={index} className={msg.senderName === nickname ? 'message-sent' : 'message-received'}>
              {/* 이름 출력 여부 결정 */}
              {msg.senderName !== nickname && <div id="message-name">{msg.senderName} </div>}
              
              {/* 시간 출력 */}
              {msg.senderName === nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}

              {msg.s3DataUrl && (
                <span>
                  {isImageFile(msg.fileName) ? (
                    <span>
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          {msg.senderName === nickname && <FileDownloadOutlinedIcon fontSize='small'/>}
                        </IconButton>
                        <img src={msg.s3DataUrl} alt="file" width="100" />
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          <FileDownloadOutlinedIcon />
                        </IconButton>
                    </span>
                  ) : (
                    <span>
                      {msg.fileName}
                      <IconButton aria-label="filedown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                      <SimCardDownloadRoundedIcon /> </IconButton>
                    </span>
                  )}
                </span>
              )}
              {!msg.s3DataUrl && (
                <span id='message-content'>{msg.message} </span>
              )}

              {msg.senderName !== nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}

            </div>
            ))}
            <hr />

            {/* 1:1 채팅내역 로드 */}
            
              {(privateChats[tab] || []).map((msg, index) => (
              <div key={index} className={msg.senderName === nickname ? 'message-sent' : 'message-received'}>
                {/* 이름 출력 여부 결정 */}
                {msg.senderName !== nickname && <div id="message-name">{msg.senderName} </div>}
                
                {/* 시간 출력 */}
                {msg.senderName === nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}

                {msg.s3DataUrl ? (
                  <span id="message-file">
                    {isImageFile(msg.fileName) ? (
                      <span>
                        <img src={msg.s3DataUrl} alt="file" width="100" />
                        <IconButton aria-label="imgdown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          <FileDownloadOutlinedIcon />
                        </IconButton>
                      </span>
                    ) : (
                      <span>
                        {msg.fileName}
                        <IconButton aria-label="filedown" size="small" onClick={() => downloadFile(msg.fileName, msg.fileDir)}>
                          <SimCardDownloadRoundedIcon />
                        </IconButton>
                      </span>
                    )}
                  </span>
                ) : (
                    <span id="message-content">{msg.message}</span>
                )}

                  {msg.senderName !== nickname && <span id='message-time'>{formatTimestamp(msg.publishedAt)}</span>}
              </div>
              ))}
          </div>
        <div className='chatroom-send'>
          <div className='chatroom-input'>
            <input type="text" id='send-private' value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <IconButton aria-label="send" size="small" onClick={handleSendPrivateMessage}>
            <SendRoundedIcon sx={{ fontSize: 25, color: "#5B96F7", ml:2 }} />
          </IconButton>
        </div>
        </div>
        }
    </div>
  );
}

export default ChatRoom;
