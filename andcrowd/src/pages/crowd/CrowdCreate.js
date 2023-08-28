import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const CrowdCreate = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(""); // userId를 상태로 설정

  useEffect(() => {
    // userId를 백엔드로부터 가져오는 로직
    // 토큰 또는 세션을 이용해 userId를 전달
    const fetchUserId = async () => {
      try{
        const response = await fetch("/pi/getUserId");
        if(response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        }else {
          throw new Error(`Fetching userId failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };
    fetchUserId();
  },[]);

  const [formData, setFormData] = useState({
    userId: "",
    crowdCategoryId: "",
    crowdTitle: "",
    crowdContent: "",
    crowdGoal: "",
    crowdReward: "",
    crowdEndDate: "",
  })

  const [images, setImages] = useState({
    crowdHeaderImg: "",
    crowdImg1: "",
    crowdImg2: "",
    crowdImg3: "",
    crowdImg4: "",
    crowdImg5: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("/crowd/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        
        if(response.ok) {
            // 성공적으로 데이터 전송 및 처리되었을 때의 코드
        }else {
            throw new Error(`Request failed with status ${response.status}`);
        }
    }catch (error) {
        console.error("Error sending data:", error);
    }
  };

  const handleSubmitBtnClick = async () => {
    try {
      const response = await fetch("/crowd/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 성공적으로 데이터 전송 및 처리되었을 때의 코드
        // 데이터를 저장하고 이동할 경로를 지정합니다.
        const responseData = await response.json();
        const crowdId = responseData; // 응답 데이터에서 andId 값을 추출
        console.log("Created crowdId:", crowdId);
        navigate(`/crowd/list`);
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleUploadCancel = () => {
    setImages([]);
    navigate('/crowd/list'); // 업로드 취소 버튼 클릭 시 페이지 전환
  };

  return (
    <div>
      <h2>펀딩 글 작성</h2>
      <form onSubmit={handleSubmit}>
        <label>
          회원번호: 
          <input type="text" name="userId" id="userId" value={userId} onChange={handleInputChange} readOnly/>
        </label>
        <br />
        <label>
          펀딩 제목:
          <input type="text" value={formData.crowdTitle} onChange={handleInputChange} placeholder="제목을 입력하세요" />
        </label>
        <br />
        <label>
          펀딩 본문:
          <textarea value={formData.crowdContent} onChange={handleInputChange} placeholder="OOO한 내용을 기획/개발해 &Crowd에 최초 공개하고자 합니다." />
        </label>
        <br />
        <label>
          마감일자:
          <input type="date" value={formData.crowdEndDate} onChange={handleInputChange} placeholder="예) 2023-12-31" />
        </label>
        <br />
        <label>
          펀딩 금액:
          <input type="number" value={formData.crowdGoal} onChange={handleInputChange} placeholder="목표 금액을 입력하세요." />
        </label>
        <br />
        <label>
          리워드 설정:
          <input type="number" value={formData.rewardId} onChange={handleInputChange} placeholder="서포터님들에게 제공할 리워드를 입력하세요." />
        </label>
        <br />
        <label>
          헤더 이미지 업로드:
          <input type="text" multiple onChange={handleImageUpload} placeholder="첨부 파일을 업로드 하세요." />
        </label>
        <br />
        <label>
          이미지1 업로드:
          <input type="file" multiple onChange={handleImageUpload} placeholder="첨부 파일을 업로드 하세요." />
        </label>
        <label>
          이미지2 업로드:
          <input type="file" multiple onChange={handleImageUpload} placeholder="첨부 파일을 업로드 하세요." />
        </label>
        <label>
          이미지3 업로드:
          <input type="file" multiple onChange={handleImageUpload} placeholder="첨부 파일을 업로드 하세요." />
        </label>
        <label>
          이미지4 업로드:
          <input type="file" multiple onChange={handleImageUpload} placeholder="첨부 파일을 업로드 하세요." />
        </label>
        <label>
          이미지5 업로드:
          <input type="file" multiple onChange={handleImageUpload} placeholder="첨부 파일을 업로드 하세요." />
        </label>
        <br />
        {/* {images.map((image, index) => (
          <div key={index}>
            <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} width="100" />
          </div>
        ))} */}
        <div>
          <button type="button" onClick={handleUploadCancel}>업로드 취소</button>
          <button type="button" onClick={handleSubmitBtnClick}>업로드</button>
        </div>
      </form>
    </div>
  );
};

export default CrowdCreate;
