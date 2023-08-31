import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndBoardUpdate = () => {
  const params = useParams();
  const andId = params.andId;
  const andBoardId = params.andBoardId;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    andId: andId,
    andBoardId: andBoardId,
    userId: "",
    andBoardTitle: "",
    andBoardContent: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/board/${andBoardId}`);

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        throw new Error(`Fetching AndBoard data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching AndBoard data:", error);
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

    console.log("formData:", formData); // 전달 값 확인

    const response = await fetch(`/and/${andId}/board/${andBoardId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    navigate(`/and/${andId}/board/${andBoardId}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            placeholder="회원번호"
          />
          <input
            type="text"
            name="andBoardTitle"
            value={formData.andBoardTitle}
            onChange={handleInputChange}
            placeholder="제목"
          />
          <input
            type="text"
            name="andBoardContent"
            value={formData.andBoardContent}
            onChange={handleInputChange}
            placeholder="내용"
          />
        </div>
        <div id="submit_btn">
          <button type="submit">저장</button>
        </div>
      </form>
    </>
  );
};

export default AndBoardUpdate;
