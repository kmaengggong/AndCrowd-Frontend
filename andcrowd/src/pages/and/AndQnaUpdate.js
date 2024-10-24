import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndQnaUpdate = () => {
  const params = useParams();
  const andId = params.andId;
  const andQnaId = params.andQnaId;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    andId: andId,
    andQnaId: andQnaId,
    userId: "",
    andQnaTitle: "",
    andQnaContent: "",
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/qna/${andQnaId}`);
      
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And Qna data:", error);
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

        console.log("formdata:", formData); // 전달 값 확인

            const response = await fetch(`/and/${andId}/qna/${andQnaId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/qna/list`);
    };

  return (
    <>
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
                <input type="text" name="andQnaTitle" value={formData.andQnaTitle} onChange={handleInputChange} placeholder="제목" />
                <input type="text" name="andQnaContent" value={formData.andQnaContent} onChange={handleInputChange} placeholder="내용" />
            </div>
            <div id="submit_btn">
                <button type="submit">저장</button>
            </div>
        </form>
    </>
    );
};


export default AndQnaUpdate;
