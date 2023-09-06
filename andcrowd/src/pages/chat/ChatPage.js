import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NicknameInput from './NicknameInput';
import ChatRoom from './Chatroom';

const ChatPage = () => {
  const params = useParams();
  const andId = params.andId;

  const [joined, setJoined] = useState(false);
  const [nickname, setNickname] = useState('');
  const [roomData, setRoomData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleJoinChat = async (nickname) => {
      const roomResponse = await fetch(`/and/chat/rooms/${nickname}`);
      const roomData = await roomResponse.json();
      setRoomData(roomData);
      setNickname(nickname);
      setJoined(true);
  };

  return (
    <div>
      {!joined ? (
        <NicknameInput onJoinChat={handleJoinChat} />
      ) : (
        <div>
          <h2>Welcome, {nickname}!</h2>
          <h3>Select a Chat Room:</h3>
          <ul>
            {roomData.map((room) => (
              <li key={room.roomId}>
                <button onClick={() => setSelectedRoom(room)}>{room.name}</button>
              </li>
            ))}
          </ul>
          {selectedRoom && (
            <ChatRoom roomData={selectedRoom} nickname={nickname} />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
