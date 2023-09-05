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
    // 사용자의 멤버 여부 확인 요청
    const memberResponse = await fetch(`http://localhost:8080/and/${andId}/check-member?nickname=${nickname}`);
    const memberData = await memberResponse.json();
  
    if (memberData.isMember) {
      const roomResponse = await fetch(`http://localhost:8080/and/${andId}/chat`);
      const roomData = await roomResponse.json();
  
      setRoomData(roomData);
      setNickname(nickname);
      setJoined(true);
    } else {
      alert("You are not a member of this group."); // 사용자가 멤버가 아닌 경우 경고 표시
    }
  };
  
    return (
        <div>
          {!joined ? (
            <NicknameInput onJoinChat={handleJoinChat} />
          ) : (
            <div>
              <h2>Welcome, {nickname}!</h2>
              <ul>
                  <ChatRoom roomData={roomData} nickname={nickname} andId={andId} />
              </ul>
            </div>
          )}
        </div>
    );
};

export default AndChat;
