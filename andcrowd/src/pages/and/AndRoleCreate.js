import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/and/AndRole.css';

const AndRoleCreate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const andId = params.andId;

  const [formData, setFormData] = useState({
    andId: andId,
    andRole: "",
    andRoleLimit: 0,
  });

  const [andRoles, setAndRoles] = useState([]);
  const [needNumMem, setNeedNumMem] = useState(0);

  useEffect(() => {
    // 페이지가 처음 로드될 때 AndRole 목록을 가져옴
    const fetchAndRoles = async () => {
      try {
        const response = await axios.get(`/and/${andId}/role/list`);
        if (response.data) {
          setAndRoles(response.data);
        }
      } catch (error) {
        console.error("Error fetching AndRoles:", error);
      }
    };

    fetchAndRoles(); // 함수 호출
  }, []); // andId가 변경될 때마다 실행

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

    const response = await fetch(`/and/${andId}/role/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log("AndRole created successfully");
      setAndRoles([...andRoles, formData]);
      setFormData({
        andId: andId,
        andRole: "",
        andRoleLimit: 0,
      });

      const newNeedNumMem = needNumMem + parseInt(formData.andRoleLimit, 10);
      console.log("newNeedNumMem: ",newNeedNumMem)
      setNeedNumMem(newNeedNumMem);
    
    } else {
      console.error("Error creating AndRole");
    }
  };

  const deleteAndRole = async (andId, andRoleId, andRoleLimit) => {
    try {
      await axios.delete(`/and/${andId}/role/${andRoleId}/delete`);
      console.log("Deleted role at index:", andRoleId);
      const newNeedNumMem = needNumMem - parseInt(andRoleLimit, 10);
      console.log("newNeedNumMem", newNeedNumMem);
      setNeedNumMem(newNeedNumMem);
    } catch (error) {
      console.error("Error in deleting role:", error);
    }
  };

  // 다음 버튼 클릭 시 페이지 이동
  const handleNextClick = async () => {
    console.log(`/${andId}/update/needNumMem/${needNumMem}`);

    try {
      await fetch(`/and/${andId}/update/status/0`, {
        method: "PATCH",
      });

      await fetch(`/and/${andId}/update/needNumMem/${needNumMem}`,{
        method: "PATCH",
      });
    console.log("update and status:", andId);
    } catch (error) {
      console.error("Error in updating and status:", error);
    }
    navigate(`/and/${andId}`);
  };

  return (
    <div className="and-role-create-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>역할명:</label>
          <input
            type="text"
            name="andRole"
            value={formData.andRole}
            onChange={handleInputChange}
            placeholder="역할명을 입력해주세요"
            required
          />
        </div>
        <div className="form-group">
          <label>필요 인원수:</label>
          <input
            type="number"
            name="andRoleLimit"
            value={formData.andRoleLimit}
            onChange={handleInputChange}
            placeholder="필요 인원수"
            required
          />
        </div>
        <div className="form-group" id="button-container">
          <button id='role-submit-btn' type="submit">
            추가
          </button>
        </div>
      </form>

      <div>
        <h2>추가된 역할</h2>
        <ul className="and-role-list">
          {andRoles.map((role, index) => (
            <li key={index}>
              {role.andRole} (필요 인원: {role.andRoleLimit}명)
              <button onClick={() => deleteAndRole(andId, role.andRoleId, role.andRoleLimit)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
      <h2> 총 모집인원: {needNumMem}명 </h2>
      <button id='role-next-btn' onClick={handleNextClick}>
        다음
      </button>
    </div>
  );
};

export default AndRoleCreate;
