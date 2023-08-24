import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndReplyUpdate = () => {
  const params = useParams();
  const andId = params.andId;
  const andQnaId = params.andQnaId;
  const andQnaReplyId = params.andQnaReplyId;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    andId: andId,
    andQnaId: andQnaId,
    andQnaReplyId: andQnaReplyId,
    userId: "",
    andReplyContent: "",
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/qna/reply/${andQnaReplyId}`);
      
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

            const response = await fetch(`/and/${andId}/qna/reply/${andQnaId}/${andQnaReplyId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/qna/${andQnaId}`);
    };

  return (
    <>
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" readOnly/>
                <input type="text" name="andReplyContent" value={formData.andReplyContent} onChange={handleInputChange} placeholder="답변내용" />
            </div>
            <div id="submit_btn">
                <button type="submit">저장</button>
            </div>
        </form>
    </>
    );
};


export default AndReplyUpdate;
