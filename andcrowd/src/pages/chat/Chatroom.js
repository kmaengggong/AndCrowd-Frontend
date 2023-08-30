import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function ChatRoom({ roomData, nickname }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [loadingPrevious, setLoadingPrevious] = useState(false);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      stomp.subscribe(`/sub/chat/room/${roomData.roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });


    setStompClient(stomp);

    // 채팅방 입장 시 이전 채팅 내용 로드
    loadPreviousMessages(roomData.roomId);

    return () => {
      if (stomp.connected) {
        stomp.disconnect();
      }
      setMessages([]); // 현재 채팅방에서 나갈 때 메시지 초기화
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

  return (
    <div>
      <h2>Chat Room: {roomData.name}</h2>
      <div>
        {previousMessages.map((msg, index) => (
          <div key={index}>
            <span>{msg.senderName}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
        <hr />
        {messages.map((msg, index) => (
          <div key={index}>
            <span>{msg.senderName}: </span>
            <span>{msg.message}</span>
          </div>
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
