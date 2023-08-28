import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AndRoleUpdate = () => {
    const params = useParams();
    const andId = params.andId;
    const andRoleId = params.andRoleId;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        andId: andId,
        andRoleId: andRoleId,
        andRole: "",
        andRoleLimit: "",
    });

    useEffect(() => {
        fetchData();
    }, [])


  const fetchData = async () => {
    try {
      const response = await fetch(`/and/${andId}/role/${andRoleId}`);
      
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

            const response = await fetch(`/and/${andId}/role/${andRoleId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/role/list`);
    };

  return (
    <>
    <form onSubmit={handleSubmit}>
        <div>
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
        </div>
    </form>
    </>
    );
};




export default AndRoleUpdate;