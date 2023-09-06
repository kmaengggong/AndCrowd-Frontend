import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from '../chat/Chatroom';
import Cookies from 'js-cookie';

const AndChat = () => {
  const params = useParams();
  const andId = params.andId;

  const [joined, setJoined] = useState(false);
  const [nickname, setNickname] = useState('');
  const [roomData, setRoomData] = useState(null);

  const yourAccessToken = Cookies.get('refresh_token');
  console.log("yourAccessToken:::: ",yourAccessToken)

  // API 엔드포인트 호출 함수
  const fetchUserNickname = async () => {
    try {
      const response = await fetch('/user-info/nickname', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${yourAccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const nickname = data.nickname; // API에서 반환한 닉네임 가져오기

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

      } else {
        // 오류 처리
        console.error('Failed to fetch user nickname');
      }
    } catch (error) {
      console.error('Error fetching user nickname:', error);
    }
  };

  // 컴포넌트 마운트 시 닉네임 가져오기
  useEffect(() => {
    fetchUserNickname();
  }, []);

  
    return (
        <div>
          {!joined ? (
            <p>모임 멤버가 아닙니다</p>
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
