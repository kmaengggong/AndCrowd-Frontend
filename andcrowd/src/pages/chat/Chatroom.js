import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function formatTimestamp(timestamp) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(timestamp).toLocaleString('ko-KR', options);
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
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;
