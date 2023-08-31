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
        setConnectedList(newMessage.userList);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      const joinMessage = {
        senderName: nickname,
        roomId: roomData.roomId,
        status: 'JOIN',
      };
      stomp.send('/app/chat/enter', {}, JSON.stringify(joinMessage));

      setStompClient(stomp);

      loadPreviousMessages(roomData.roomId);
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

  return (
    <div>
      <div>
        <h3>Chat Members: 닉네임(이름)</h3>
        {members.map((member, index) => (
          <div key={index}>
            <span>{member.userNickname}</span>
            <span>({member.userKorName})</span>
            {connectedList && connectedList.includes(member.userNickname) && (
              <span> - Online</span>
            )}
          </div>
        ))}
      </div>
      <hr />
      <div>
        <span style={{ marginRight: '10px', fontWeight: 'bold', fontSize: 20 }}>
          Chat Room: {roomData.name}
        </span>
        <button onClick={() => updateChatroom(roomData.roomId)}>이름 수정</button>
      </div>
      <div>
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
      <input type="file" id="file" onChange={handleFileChange} />
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;
