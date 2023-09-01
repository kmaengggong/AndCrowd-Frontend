import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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

function ChatRoom({ roomData, nickname, andId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [connectedList, setConnectedList] = useState([]);
  const [tab, setTab] = useState('CHATROOM');
  const [privateChats, setPrivateChats] = useState({}); 
  const [previousPrivateMessages, setPreviousPrivateMessages] = useState([]); 

  const navigate = useNavigate();

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stomp = Stomp.over(socket);

    const handleBeforeUnload = () => {
      if (stomp) {
        const leaveMessage = {
          senderName: nickname,
          roomId: roomData.roomId,
          status: 'LEAVE',
        };
        stomp.send('/app/chat/out', {}, JSON.stringify(leaveMessage));
        stomp.disconnect();
      }
    };

    stomp.connect({}, () => {
      stomp.subscribe(`/sub/chat/room/${roomData.roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        
        if(newMessage.status !== "MESSAGE"){
          setConnectedList(newMessage.userList);}
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      stomp.subscribe('/user/'+nickname+'/private', onPrivateMessage);

      const joinMessage = {
        senderName: nickname,
        roomId: roomData.roomId,
        status: 'JOIN',
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
          status: 'LEAVE',
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
      } else {
        throw new Error(`Fetching chat members failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading chat members:', error);
    }
  };

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
        status: "MESSAGE",
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
        status:"MESSAGE",
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
          status: 'MESSAGE',
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
    setTab(name);
  };
  
  const handleChatRoomClick = () => {
    setTab('CHATROOM');
  };

  return (
    <div>
      
        {/* 채팅방 이름 조회 및 출력 */}
        <div>
          <span
            onClick={handleChatRoomClick}
            style={{ marginRight: '10px', fontWeight: 'bold', fontSize: 20 }}
            className={`member ${tab === 'CHATROOM' && 'active'}`}
          >          Chat Room: {roomData.name}
          </span>
          <button onClick={() => updateChatroom(roomData.roomId)}>이름 수정</button>
        </div>


        {/* 모임 참여자 목록 */}
        <div>
          <h3>Chat Members: 닉네임(이름)</h3>
          {members.map((member, index) => (
            <div 
              key={index} 
              onClick={() => handleMemberClick(member.userNickname)}
              className={`member ${tab===member.userNickname && "active"}`}>
              <span>{member.userNickname}</span>
              <span>({member.userKorName})</span>
              {connectedList && connectedList.includes(member.userNickname) && (
                <span> - Online</span>
              )}
            </div>
          ))}
        </div>
        <hr />
        
        {tab==="CHATROOM" &&
        <div>
          <div>
            {/* DB에 저장된 메세지 출력 */}
            {previousMessages.map((msg, index) => (
            <div key={index}>
              <span>{msg.senderName}: </span>
              {msg.s3DataUrl && (
                <div>
                  {isImageFile(msg.fileName) ? (
                    <div>
                      <img src={msg.s3DataUrl} alt="file" width="100" />
                      <button onClick={() => downloadFile(msg.fileName, msg.fileDir)}>Download</button>
                    </div>
                  ) : (
                    <div>
                      {msg.fileName}
                      <button onClick={() => downloadFile(msg.fileName, msg.fileDir)}>Download</button>
                    </div>
                  )}
                </div>
              )}
              {!msg.s3DataUrl && (
                <span>{msg.message} </span>
              )}
              <span>{formatTimestamp(msg.publishedAt)}</span> 
            </div>
            ))}
            <hr />

            {/* 접속 후의 메세지 출력 */}
            {messages.map((msg, index) =>
              msg.status === 'MESSAGE' && (
                <div key={index}>
                  <span>{msg.senderName}: </span>
                  {msg.s3DataUrl ? (
                    <div>
                      {isImageFile(msg.fileName) ? (
                        <div>
                          <img src={msg.s3DataUrl} alt="file" width="100" />
                          <button onClick={() => downloadFile(msg.fileName, msg.fileDir)}>Download</button>
                        </div>
                      ) : (
                        <div>
                          {msg.fileName}
                          <button onClick={() => downloadFile(msg.fileName, msg.fileDir)}>Download</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{msg.message} </span> 
                  )}
                  <span>{formatTimestamp(msg.publishedAt)}</span> 
                </div>
              )
            )}
          </div>
          <div>
            <input type="file" id="file" onChange={handleFileChange} />
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
        }
        {tab!=="CHATROOM" &&
        <div>
          <h4>{tab}과의 1:1 채팅</h4>
          <div>
            {/* DB에 저장된 메세지 출력 */}
            {previousPrivateMessages.map((msg, index) => (
            <div key={index}>
              <span>{msg.senderName}: </span>
              {msg.s3DataUrl && (
                <div>
                  {isImageFile(msg.fileName) ? (
                    <div>
                      <img src={msg.s3DataUrl} alt="file" width="100" />
                      <button onClick={() => downloadFile(msg.fileName, msg.fileDir)}>Download</button>
                    </div>
                  ) : (
                    <div>
                      {msg.fileName}
                      <button onClick={() => downloadFile(msg.fileName, msg.fileDir)}>Download</button>
                    </div>
                  )}
                </div>
              )}
              {!msg.s3DataUrl && (
                <span>{msg.message} </span>
              )}
              <span>{formatTimestamp(msg.publishedAt)}</span> 
            </div>
            ))}
            <hr />
            </div>
          <div>
            {/* 1:1 채팅내역 로드 */}
            <ul className="chat-messages">
              {(privateChats[tab] || []).map((chat, index) => (
              <div>
                <li className={`message ${chat.senderName === nickname && "self"}`} key={index}>
                  {chat.senderName !== nickname && 
                  <div className="avatar">
                    {chat.senderName}
                  </div>}
                  {chat.senderName === nickname && 
                  <div className="avatar self">
                    {chat.senderName}
                  </div>}
                  <div className="message-data">
                    {chat.message}
                  </div>
                  <div className="message-data">
                    {formatTimestamp(chat.publishedAt)}<br />
                    <br />
                  </div>
                </li>
                </div>
              ))}
            </ul>
          </div>
          <div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendPrivateMessage}>Send</button>
          </div>
        </div>
        }
    </div>
  );
}

export default ChatRoom;
