import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../styles/crowd/CrowdRewardUpdate.css';
import { Modal, ModalClose, Sheet } from "@mui/joy";

const CrowdRewardUpdate = () => {
  const params = useParams();
  const crowdId = params.crowdId;
  const rewardId = params.rewardId;

  const navigate = useNavigate();

  const [rewards, setRewards] = useState([]);
  const [reward, setReward] = useState({});
  const [formData, setFormData] = useState({
    crowdId: crowdId,
    rewardId: rewardId,
    rewardTitle: "",
    rewardContent: "",
    rewardAmount: 0,
    rewardLimit: 0,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => { // 기존 리워드 데이터 불러오기
    try {
      const response = await axios.get(`/crowd/${crowdId}/reward/all`);
      if (response.status === 200) {
        setRewards(response.data);
      } else {
        console.error(`Error fetching rewards with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };
  

  const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value)
        let newValue = value;
    
        if (name === "rewardAmount") {
        newValue = Math.max(0, parseFloat(newValue));
        }
        if (name === "rewardLimit") {
        newValue = Math.max(0, parseFloat(newValue));
        }
    
        setReward({ ...formData, [name]: newValue });
  };

  const handleUpdate = async (event) => { // crowd의 특정 rewardId를 선택해 불러와 업데이트
    event.preventDefault();
    const response = await fetch(`/crowd/${crowdId}/reward/${reward.rewardId}/update`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reward),
    });

    if(response.ok) {
        console.log("rewards updated successfully");
        setOpen(false);

        // const updatedRewardLimit = parseInt(reward.rewardLimit, 10);
        // const updatedCrowdLimit = rewards.map((limit) => {
        //     if(limit.rewardId === reward.rewardId) {
        //         // 수정된 리워드의 수량값을 업데이트
        //         return {
        //             ...limit,
        //             rewardLimit: updatedCrowdLimit,
        //         };
        //     }
        //     return limit;
        // });
        // const updatedRewardAmount = parseInt(reward.rewardAmount, 10);
        // const updatedCrowdAmount = rewards.map((amount) => {
        //     if(amount.rewardId === reward.rewardId) {
        //         // 수정된 리워드의 금액을 업데이트
        //         return{
        //             ...amount,
        //             rewardAmount: updatedCrowdAmount,
        //         };
        //     }
        //     return amount;
        // });

        fetchRewards();
    } else {
        console.error("Error updating rewards");
    }
  };

  const openModal = async (rewardId) => { // 수정시 모달창 열림
    setOpen(true);
    try {
        const response = await fetch(`/crowd/${crowdId}/reward/${rewardId}`);
        console.log("response:", response);
        if(response.ok) {
            const data = await response.json();
            setReward(data);
        } else {
            throw new Error(`Fetching and role data failed with status ${response.status}.`);
        }
    } catch (error) {
        console.error("Error fetching reward:", error);
    }
  }

  const handleInputUpdate = (event) => { // 수정
    const {name, value} = event.target;
    setReward({
        ...reward,
        [name]: value,
    });
  }

  const handleSubmit = async () => { // 저장 버튼 클릭시 크라우드 디테일페이지 이동
    console.log("formData:", formData);
    const response = await fetch(`/crowd/${crowdId}/reward/${rewardId}/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if(response.ok) {
        console.log("reward created successfully");
        setRewards([...rewards, formData]);
        setReward({
            rewardId: rewardId,
            rewardTitle: "",
            rewardContent: "",
            rewardAmount: 0,
            rewardLimit: 0,
        });

        fetchRewards();
    } else {
        console.error("Error creating rewards");
    }
    navigate(`/crowd/${crowdId}`);
  };

  const deleteReward = async (crowdId, rewardId) => { // 삭제
    console.log(`/crowd/${crowdId}/reward/${rewardId}/delete`);
    try{
        await axios.delete(`/crowd/${crowdId}/reward/${rewardId}/delete`);
        console.log("Deleted reward at index:", rewardId);
        fetchRewards();
    } catch (error){
        console.error("Error in deleting reward:", error);
    }
  };

  return (
    <div className="crowd-reward-update-container">
        <div>
            <h2>리워드를 수정해보세요</h2>
            <h3>저장된 리워드</h3>
            <ul className="crowd-reward-list">
            {rewards.map((reward, index) => (
              <li key={index}>
                <p>리워드 제목: {reward.rewardTitle}</p> <br />
                <p>리워드 본문: {reward.rewardContent}</p> <br />
                <p>리워드 금액: {reward.rewardAmount}원</p> <br />
                <p>리워드 수량: {reward.rewardLimit}개</p> <br />
                <button id="updateAndDelete" onClick={() => openModal(reward.rewardId)}>수정</button>
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
                        <label>리워드명:</label>
                        <input
                          type="text"
                          name="rewardTitle"
                          value={reward.rewardTitle}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>리워드내용:</label>
                        <input
                          type="text"
                          name="rewardContent"
                          value={reward.rewardContent}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>리워드 금액:</label>
                        <input
                          type="number"
                          name="rewardAmount"
                          value={reward.rewardAmount}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div><div className="form-group">
                        <label>리워드 수량:</label>
                        <input
                          type="number"
                          name="rewardLimit"
                          value={reward.rewardLimit}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group" id="button-container">
                        <button id='reward-submit-btn' type="submit">
                          수정
                        </button>
                      </div>
                    </form>
                  </Sheet>
                </Modal>
                <button id="updateAndDelete" onClick={() => deleteReward(crowdId, reward.rewardId)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
        {/* 추가할 리워드 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>리워드명:</label>
            <input
              type="text"
              name="rewardTitle"
              value={formData.rewardTitle}
              onChange={handleInputChange}
              placeholder="리워드명을 입력하세요."
              required
            />
          </div>
          <div className="form-group">
            <label>리워드내용:</label>
            <input
              type="text"
              name="rewardContent"
              value={formData.rewardContent}
              onChange={handleInputChange}
              placeholder="리워드에대해 간단히 설명 해주세요."
              required
            />
          </div>
          <div className="form-group">
            <label>금액:</label>
            <input
              type="number"
              name="rewardAmount"
              value={formData.rewardAmount}
              onChange={handleInputChange}
              placeholder="리워드 금액"
              required
            />
          </div>
          <div className="form-group">
            <label>수량:</label>
            <input
              type="number"
              name="rewardLimit"
              value={formData.rewardLimit}
              onChange={handleInputChange}
              placeholder="리워드 수량"
              required
            />
          </div>
          <div className="form-group" id="button-container">
            <button id='reward-submit-btn' type="submit">
              추가
            </button>
          </div>
        </form>
        <button id='reward-next-btn' onClick={handleSubmit}>
          저장
        </button>
    </div>
  );
};

export default CrowdRewardUpdate;
