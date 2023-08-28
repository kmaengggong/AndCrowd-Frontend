import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndRoleCreate = () => {
  const navigate = useNavigate();

  const params = useParams();
  const andId = params.andId;

  const [formData, setFormData] = useState({
    andId: andId,
    andRole: "",
    andRoleLimit: 0,
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

    console.log("formData:", formData); // 전달 값 확인
    
    const response = await fetch(`/and/${andId}/role/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log("AndRole created successfully");
      navigate(`/and/${andId}/role/list`);
    } else {
      console.error("Error creating AndRole");
    }
  };

  return (
    <>
      <h1>Create AndRole</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>AndRole:</label>
          <input
            type="text"
            name="andRole"
            value={formData.andRole}
            onChange={handleInputChange}
            placeholder="And 역할"
            required
          />
        </div>
        <div>
          <label>AndRole 제한:</label>
          <input
            type="number"
            name="andRoleLimit"
            value={formData.andRoleLimit}
            onChange={handleInputChange}
            placeholder="And 역할 제한"
            required
          />
        </div>
        <div id="submit_btn">
          <button type="submit">저장</button>
        </div>
      </form>
    </>
  );
};

export default AndRoleCreate;
