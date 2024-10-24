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

  const [crowdReward, setCrowdReward] = useState({});
  const [rewards, setRewards] = useState([]);
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
    fetchCrowdData();
    fetchRewards();
  }, []);

  const fetchCrowdData = async () => {
    try{
      const response = await fetch(`/crowd/${crowdId}`);
      if(response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error(`Fetching crowd data failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error("Error fetching Crowd data: ", error);
    }
  };

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

    setFormData({ ...formData, [name]: newValue });
  };

  const handleUpdate = async (event) => { // crowd의 특정 rewardId를 선택해 불러와 업데이트

    console.log("handleUpdate: ", crowdReward)
    event.preventDefault();
    const response = await fetch(`/crowd/${crowdId}/reward/${crowdReward.rewardId}/update`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(crowdReward),
    });

    if(response.ok) {
        console.log("rewards updated successfully");
        setOpen(false);
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
            setCrowdReward(data);
        } else {
            throw new Error(`Fetching and role data failed with status ${response.status}.`);
        }
    } catch (error) {
        console.error("Error fetching reward:", error);
    }
  }

  const handleInputUpdate = (event) => { // 수정
    const {name, value} = event.target;
    setCrowdReward({
        ...crowdReward,
        [name]: value,
    });
  }

  const handleRewardAdd = () => {
    const newReward = { ...formData };
    if(newReward.rewardTitle.length < 1){
      alert("제목을 설정해주세요.");
      return;
    }
    if(newReward.rewardContent.length < 1){
      alert("내용을 설정해주세요.");
      return;
    }
    if(newReward.rewardAmount < 1){
      alert("금액을 설정해주세요.");
      return;
    }
    if(newReward.rewardLimit < 1){
      alert("한정수량을 선택해주세요.");
      return;
    }
    setRewards([...rewards, newReward]);
    setFormData({
      crowdId: crowdId,
      rewardTitle: "",
      rewardContent: "",
      rewardAmount: 0,
      rewardLimit: 0,
    });
  };

  const handleSubmit = async (e) => { // 추가된 리워드는 생성이므로 저장 버튼 클릭시 create 되도록
    console.log("formData:", formData);
    e.preventDefault();
    const response = await fetch(`/crowd/${crowdId}/reward`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if(response.ok) {
      console.log("reward created successfully");
      setRewards([...rewards, formData]);
      setFormData({
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
  };

  const deleteReward = async (crowdId, rewardId) => { // 전체 리워드 리스트에서 특정 리워드만 삭제
    console.log(`/crowd/${crowdId}/reward/${rewardId}/delete`);
    try{
        await axios.delete(`/crowd/${crowdId}/reward/${rewardId}/delete`);
        console.log("Deleted reward at index:", rewardId);
        
        // 삭제된 리워드를 제외하고 새로운 리스트 생성
        const updatedRewards = rewards.filter((reward) => reward.rewardId !== rewardId);
        setRewards(updatedRewards);
    } catch (error){
        console.error("Error in deleting reward:", error);
    }
  };

  const handleNextButtonClick = async () => {
    // try{
    //   await fetch(`/crowd/${crowdId}/reward/${rewardId}/update`,{
    //     method: "PATCH",
    //   });
    //   console.log("update crowd status:",crowdId);
    // } catch (error) {
    //   console.error("Error in updating reward:", error);
    // }
    alert("펀딩글이 성공적으로 수정되었습니다.");
    navigate(`/crowd/${crowdId}`);
  }

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
                <p>리워드 금액: {reward.rewardAmount.toLocaleString()}원</p> <br />
                <p>리워드 수량: {reward.rewardLimit.toLocaleString()}개</p> <br />
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
                          value={crowdReward.rewardTitle}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>리워드내용:</label>
                        <input
                          type="text"
                          name="rewardContent"
                          value={crowdReward.rewardContent}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>리워드 금액:</label>
                        <input
                          type="number"
                          name="rewardAmount"
                          value={crowdReward.rewardAmount}
                          onChange={handleInputUpdate}
                          required
                        />
                      </div><div className="form-group">
                        <label>리워드 수량:</label>
                        <input
                          type="number"
                          name="rewardLimit"
                          value={crowdReward.rewardLimit}
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
            <button id='reward-submit-btn' type="submit" 
            // onClick={handleRewardAdd}
            >
              추가
            </button>
          </div>
        </form>
        <button id='reward-next-btn' onClick={handleNextButtonClick}>
          저장
        </button>
    </div>
  );
};

export default CrowdRewardUpdate;
