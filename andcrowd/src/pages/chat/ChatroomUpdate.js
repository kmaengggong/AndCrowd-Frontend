import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";


const ChatroomUpdate = () => {

    const params = useParams();
    const roomId = params.roomId;
    const andId = params.andId;

    const navigate = useNavigate();


  const [newName, setNewName] = useState('');

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameUpdate = async () => {
    if (newName.trim() !== '') {
      try {
        const response = await fetch(`/and/${andId}/chat/room/${roomId}/name-update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newName),
        });

        if (response.ok) {
          // Handle successful update, maybe refresh the room data if needed
        } else {
          // Handle error case
          console.error('Failed to update chat room name:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating chat room name:', error);
      } finally {
        setNewName('');
      }
      navigate(`/and/${andId}/chat`);
    }
  };  

  return (
    <div>
      <h2>Update Chat Room Name</h2>
      <div>
        <input
          type="text"
          value={newName}
          onChange={handleNameChange}
          placeholder="Enter new name"
        />
        <button onClick={handleNameUpdate}>Update</button>
      </div>
    </div>
  );
};

export default ChatroomUpdate;
