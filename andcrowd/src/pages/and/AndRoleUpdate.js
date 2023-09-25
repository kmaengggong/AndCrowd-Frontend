import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/and/AndRoleUpdate.css';
import { Button, List, ListItem, Modal, ModalDialog, ModalClose, Sheet, Typography } from '@mui/joy';

const AndRoleUpdate = () => {
    const params = useParams();
    const andId = params.andId;
    const andRoleId = params.andRoleId;

    const navigate = useNavigate();

    const [needNumMem, setNeedNumMem] = useState('');
    const [andRoles, setAndRoles] = useState([]);
    const [andRole, setAndRole] = useState({});
    const [formData, setFormData] = useState({
        andId: andId,
        andRoleId: andRoleId,
        andRole: "",
        andRoleLimit: "",
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
      fetchAndRoles();
      fetchAndData();
    }, [])


  const fetchAndData = async () => {
    try {
      const response = await fetch(`/and/${andId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data.needNumMem);
        setNeedNumMem(data.needNumMem);
      } else {
        throw new Error(`Fetching and data failed with status ${response.status}.`);
      }

    } catch (error) {
      console.error("Error fetching And Qna data:", error);
    }
  };

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


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const updateAndRole = async (event) => {

  //   console.log("formdata:", formData); // 전달 값 확인

  //   const response = await fetch(`/and/${andId}/role/${andRoleId}/update`, {
  //       method: "PATCH",
  //       headers: {
  //           "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //   });

  //   setOpen(false);
  // };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const response = await fetch(`/and/${andId}/role/${andRole.andRoleId}/update`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(andRole),
    });

    if (response.ok) {
      console.log("AndRole updated successfully");
      // 모달 닫기 또는 다른 필요한 동작 수행
      setOpen(false);

      // 수정된 역할의 andRoleLimit 값을 가져와서 업데이트
      const updatedRoleLimit = parseInt(andRole.andRoleLimit, 10);
      const updatedAndRoles = andRoles.map((role) => {
        if (role.andRoleId === andRole.andRoleId) {
          // 수정된 역할의 andRoleLimit 값을 업데이트
          return {
            ...role,
            andRoleLimit: updatedRoleLimit,
          };
        }
        return role;
      });

      // 모든 역할의 andRoleLimit 합계 계산
      const newNeedNumMem = updatedAndRoles.reduce((total, role) => {
        return total + parseInt(role.andRoleLimit, 10);
      }, 0);

      console.log("newNeedNumMem: ", newNeedNumMem);
      setNeedNumMem(newNeedNumMem);
      updateNeedNumMem(newNeedNumMem);

      // 역할 목록을 다시 불러올 수 있도록 fetchAndRoles() 함수 호출
      fetchAndRoles();
    } else {
      console.error("Error updating AndRole");
    }
  }

  const openModal = async (andRoleId) => {
    setOpen(true);

    try {
      const response = await fetch(`/and/${andId}/role/${andRoleId}`);
      console.log("response:", response);
      if (response.ok) {
        const data = await response.json();
        setAndRole(data);
      } else {
        throw new Error(`Fetching and role data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching And role data:", error);
    }

  }

  const handleInputUpdate = (event) => {
    const { name, value } = event.target;
    setAndRole({
      ...andRole,
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
      const nonNegativeNeedNumMem = newNeedNumMem < 0 ? 0 : newNeedNumMem; // 음수이면 0으로 설정
      console.log("newNeedNumMem: ", nonNegativeNeedNumMem);
      setNeedNumMem(nonNegativeNeedNumMem);
      updateNeedNumMem(nonNegativeNeedNumMem);
      fetchAndRoles();
    } else {
      console.error("Error creating AndRole");
    }
  };


  const deleteAndRole = async (andId, andRoleId, andRoleLimit) => {
    console.log(`/and/${andId}/role/${andRoleId}/delete`);
    try {
      await axios.delete(`/and/${andId}/role/${andRoleId}/delete`);
      console.log("Deleted role at index:", andRoleId);
      const newNeedNumMem = needNumMem - parseInt(andRoleLimit, 10);
      const nonNegativeNeedNumMem = newNeedNumMem < 0 ? 0 : newNeedNumMem; // 음수이면 0으로 설정
      console.log("newNeedNumMem", nonNegativeNeedNumMem);
      setNeedNumMem(nonNegativeNeedNumMem);
      fetchAndRoles();
    } catch (error) {
      console.error("Error in deleting role:", error);
    }
  };

  const updateNeedNumMem = async (needNumMem) => {
    console.log(`/${andId}/update/needNumMem/${needNumMem}`);
    try {
      await fetch(`/and/${andId}/update/needNumMem/${needNumMem}`,{
        method: "PATCH",
      });
    } catch (error) {
    }
  };

  // 다음 버튼 클릭 시 페이지 이동
  const handleNextClick = async () => {
    navigate(`/and/${andId}`);
  };


  return (
      <div className="and-role-create-container">
        <div>
          <h2> 총 모집인원: {needNumMem}명 </h2>
          <h2>저장된 역할</h2>
          <ul className="and-role-list">
            {andRoles.map((role) => (
              <li key={role.andRoleId}>
                <p id="role-content">{role.andRole} (필요 인원: {role.andRoleLimit}명) </p>
                <button id="updateAndDelete" onClick={() => openModal(role.andRoleId)}>수정</button>
                <Modal
                  aria-labelledby="modal-title"
                  aria-describedby="modal-desc"
                  open={open}
                  onClose={() => setOpen(false)}
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Sheet
                    variant="outlined"
                    sx={{
                      maxWidth: 500,
                      borderRadius: 'md',
                      p: 3,
                      boxShadow: 'lg',
                    }}
                  >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <form onSubmit={handleUpdate}>
                      <div className="form-group">
                        <label>역할명:</label>
                        <input
                          type="text"
                          name="andRole"
                          value={andRole.andRole}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>필요 인원수:</label>
                        <input
                          type="number"
                          name="andRoleLimit"
                          value={andRole.andRoleLimit}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group" id="button-container">
                        <button id='role-submit-btn' type="submit">
                          수정
                        </button>
                      </div>
                    </form>
                  </Sheet>
                </Modal>
                <button id="updateAndDelete" onClick={() => deleteAndRole(andId, role.andRoleId, role.andRoleLimit)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
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
        <button id='role-next-btn' onClick={handleNextClick}>
          저장
        </button>
      </div>
    );  
};




export default AndRoleUpdate;