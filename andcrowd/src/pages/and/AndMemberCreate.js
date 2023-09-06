import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndMemberCreate = () => {
  const navigate = useNavigate();

  const params = useParams();
  const andId = params.andId;

  const [formData, setFormData] = useState({
    andId: andId,
    userId: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("formData:", formData);

    try {
      const response = await fetch(`/and/${andId}/member/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate(`/and/${andId}/member/list`);
      } else {
        throw new Error(`회원 생성 실패, 상태: ${response.status}.`);
      }
    } catch (error) {
      console.error("회원 생성 오류:", error);
    }
  };

  return (
    <>
      <h1>And 멤버 생성</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            placeholder="사용자 ID"
            required
          />
        </div>
        <div id="submit_btn">
          <button type="submit">회원 생성</button>
        </div>
      </form>
    </>
  );
};

export default AndMemberCreate;
