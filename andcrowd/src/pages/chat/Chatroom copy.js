import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function formatTimestamp(timestamp) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(timestamp).toLocaleString('ko-KR', options);
}

function downloadFile(name, dir) {
  const url = `/s3/download/${name}`;

  fetch(`/s3/download/${name}`, {
    method: 'GET',
    responseType: 'blob', // 파일 다운로드를 위해 blob 타입으로 받아야함
    headers: {
      Accept: 'application/octet-stream', // 서버에게 파일 다운로드 요청을 보냄
    },
  })
    .then(response => response.blob()) // 응답을 blob 형태로 변환
    .then(blob => {
      // Blob 데이터로부터 다운로드 링크 생성
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = name;
      downloadLink.click();
    })
    .catch(error => {
      console.error('Error downloading file:', error);
      alert('Error downloading file.');
    });
}

function ChatRoom({ roomData, nickname, andId }) {

  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [members, setMembers] = useState([]);
  const [connectedList, setConnectedList] = useState([]);

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

    setStompClient(stomp);

    // 채팅방 입장 시 이전 채팅 내용 로드
    loadPreviousMessages(roomData.roomId);

    // 채팅방 멤버 목록 로드
    loadChatMembers(roomData.roomId);    

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
  }, [roomData.roomId]);

  const loadPreviousMessages = async () => {
    try {
      setLoadingPrevious(true);
      const response = await fetch(`/and/message/${roomData.roomId}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousMessages(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error('Error loading previous messages:', error);
    } finally {
      setLoadingPrevious(false);
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
    formData.append("file", selectedFile);
    formData.append("roomId", roomData.roomId);
  
    try {
      // 파일 업로드
      const response = await fetch('/s3/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // 파일 업로드가 성공한 경우, 메시지 생성 및 전송
        const chatMessage = {
          roomId: roomData.roomId,
          sender: nickname,
          message: `${nickname}님의 파일 업로드`,
          type: 'TALK',
          s3DataUrl: data.s3DataUrl, // Dataurl
          fileName: selectedFile.name, // 원본 파일 이름
          fileDir: data.fileDir, // 업로드 된 위치
        };
  
        stompClient.send("/pub/chat/sendMessage", {}, JSON.stringify(chatMessage));
      } else {
        throw new Error(`File upload failed with status ${response.status}.`);
      }
    } catch (error) {
      alert(error);
    }
  };

  

  return (
    <div>
      <div>
        <h3>Chat Members: 닉네임(이름)</h3>
        {members.map((member, index) => (
          <div
            key={index}
          >
            <span>{member.userNickname}</span>
            <span>({member.userKorName})</span>
            {connectedList.includes(member.userNickname) && (
            <span> - Online</span>)}
          </div>
        ))}
      </div>
      <hr />
      <div>
        <span style={{ marginRight: '10px', fontWeight: "bold", fontSize: 20 }}>Chat Room: {roomData.name}</span>
        <button onClick={() => updateChatroom(roomData.roomId)}>이름 수정</button> {/*나중에 모달창으로 바꾸면 좋을 것 같음*/}
      </div>
      <div>
        {previousMessages.map((msg, index) => (
          <div key={index}>
            <span>{msg.senderName}: </span>
            <span>{msg.message} </span>
            <span>{formatTimestamp(msg.publishedAt)}</span>
          </div>
        ))}
        <hr />
        {messages.map((msg, index) => (
          // msg.status가 'message'인 경우에만 렌더링
          msg.status === 'message' && (
            <div key={index}>
              <span>{msg.senderName}: </span>
              <span>{msg.message} </span>
              <span>{formatTimestamp(msg.publishedAt)}</span>
            </div>
          )
        ))}
      </div>
      <input type="file" id="file" onChange={handleFileChange} />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
  function renderMessage(chat, index) {
    return (
      <div key={index}>
        <span>{chat.senderName}: </span>
        {chat.s3DataUrl ? (
          // 파일이 있는 경우 이미지와 다운로드 버튼 표시
          <div>
            <img src={chat.s3DataUrl} width="300" height="300" alt="uploaded" />
            <button onClick={() => downloadFile(chat.fileName, chat.fileDir)}>
              Download
            </button>
          </div>
        ) : (
          // 파일이 없는 경우 메시지만 표시
          <span>{chat.message} </span>
        )}
        <span>{formatTimestamp(chat.publishedAt)}</span>
      </div>
    );
  }
}

export default ChatRoom;
