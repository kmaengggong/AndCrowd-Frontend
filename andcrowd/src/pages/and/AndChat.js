import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NicknameInput from '../chat/NicknameInput';
import ChatRoom from '../chat/Chatroom';

const AndChat = () => {
  const params = useParams();
  const andId = params.andId;

  const [joined, setJoined] = useState(false);
  const [nickname, setNickname] = useState('');
  const [roomData, setRoomData] = useState(null);

  const handleJoinChat = async (nickname) => {
    const roomResponse = await fetch(`http://localhost:8080/and/${andId}/chat`);
    const roomData = await roomResponse.json();
      setRoomData(roomData);
      setNickname(nickname);
      setJoined(true);
      console.log(roomData);
    };

    return (
        <div>
          {!joined ? (
            <NicknameInput onJoinChat={handleJoinChat} />
          ) : (
            <div>
              <h2>Welcome, {nickname}!</h2>
              <ul>
                  <ChatRoom roomData={roomData} nickname={nickname} />
              </ul>
            </div>
          )}
        </div>
    );
};

export default AndChat;
