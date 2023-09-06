import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndMemberUpdate = () => {
  const params = useParams();
  const andId = params.andId;
  const memberId = params.memberId; // AndMemberUpdate에서 필요한 파라미터 추가

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    andId: andId,
    memberId: memberId, // 파라미터 추가
    userId: "",
    // 다른 필드들 추가
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/member/${memberId}`); // URL 수정
      
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And Member data:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("formdata:", formData); 

    const response = await fetch(`/and/${andId}/member/${memberId}/update`, { 
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    navigate(`/and/${andId}/member/list`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="유저 아이디" />
        </div>
        <div id="submit_btn">
          <button type="submit">저장</button>
        </div>
      </form>
    </>
  );
};

export default AndMemberUpdate;
