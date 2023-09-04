import React, { useState } from 'react';

function NicknameInput({ onJoinChat }) {
  const [nickname, setNickname] = useState('');

  const handleJoinClick = () => {
    if (nickname.trim() !== '') {
      onJoinChat(nickname);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={handleJoinClick}>Join Chat</button>
    </div>
  );
}

export default NicknameInput;
