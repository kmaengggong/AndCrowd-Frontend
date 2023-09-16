import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CrowdUpdate = () => {
    const params = useParams();
    const crowdId = params.crowdId;

    const [formData, setFormData] = useState({
        userId: "",
        crowdCategoryId: "",
        crowdTitle: "",
        crowdContent: "",
        crowdEndDate: "",
        headerImg: "",
        crowdImg1: "",
        crowdImg2: "",
        crowdImg3: "",
        crowdImg4: "",
        crowdImg5: "",
    });

    const fetchCrowdData = async () => {
    useEffect(() =>{
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const response = await fetch(`/crowd/${crowdId}`);

            if(response.ok) {
                const data = await response.json();
                setFormData(data);
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() =>{
        fetchCrowdData();
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]:value,
        });
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("전달된 form:", formData);

        try {
            const response = await fetch(`/crowd/${crowdId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if(response.ok) {
                navigate(`/crowd/${crowdId}`);
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUploadCancel = () => {
        alert("작성이 취소되었습니다.");
        navigate(`/crowd/${crowdId}`); // 업로드 취소 버튼 클릭 시 페이지 전환
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                회원번호: <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" readOnly/> <br/>
                카테고리: <input type="text" name="crowdCategoryId" value={formData.crowdCategoryId} onChange={handleInputChange} placeholder="카테고리" /> <br/>
                펀딩 제목: <input type="test" name="crowdTitle" value={formData.crowdTitle} onChange={handleInputChange} placeholder="펀딩제목" /> <br/>
                펀딩 본문: <input type="text" name="crowdContent" value={formData.crowdContent} onChange={handleInputChange} placeholder="펀딩본문" /> <br/>
                마감일자: <input type="datetime-local" name="crowdEndDate" value={formData.crowdEndDate} onChange={handleInputChange} placeholder="마감일자" /> <br/>
                헤더이미지: <input type="text" name="headerImg" value={formData.headerImg} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 헤더이미지" /> <br/>
                본문사진1: <input type="text" name="crowdImg1" value={formData.crowdImg1} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진1" /> <br/>
                본문사진2: <input type="text" name="crowdImg2" value={formData.crowdImg2} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진2" /> <br/>
                본문사진3: <input type="text" name="crowdImg3" value={formData.crowdImg3} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진3" /> <br/>
                본문사진4: <input type="text" name="crowdImg4" value={formData.crowdImg4} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진4" /> <br/>
                본문사진5: <input type="text" name="crowdImg5" value={formData.crowdImg5} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진5" /> <br/>
                <button type="submit">수정하기</button>
            </form>
            <div id="cancelBtn">
                <button type="button" onClick={handleUploadCancel}>취소</button>
            </div>
        </div>
    );
}
}
export default CrowdUpdate;