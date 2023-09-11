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

    useEffect(() =>{
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const response = await fetch(`/crowd/detail/${crowdId}`);

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
                method: [{PUT, PATCH}],
                headers: {
                    "ContentType": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if(response.ok) {
                navigate(`/crowd/detail/${crowdId}`);
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                회원번호: <input type="text" id="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
                카테고리: <input type="text" id="crowdCategoryId" value={formData.crowdCategoryId} onChange={handleInputChange} placeholder="카테고리" />
                펀딩 제목: <input type="test" id="crowdTitle" value={formData.crowdTitle} onChange={handleInputChange} placeholder="펀딩제목" />
                펀딩 본문: <input type="text" id="crowdContent" value={formData.crowdContent} onChange={handleInputChange} placeholder="펀딩본문" />
                마감일자: <input type="datetime-local" id="crowdEndDate" value={formData.crowdEndDate} onChange={handleInputChange} placeholder="마감일자" />
                헤더이미지: <input type="text" id="headerImg" value={formData.headerImg} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 헤더이미지" />
                본문사진1: <input type="text" id="crowdImg1" value={formData.crowdImg1} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진1" />
                본문사진2: <input type="text" id="crowdImg2" value={formData.crowdImg2} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진2" />
                본문사진3: <input type="text" id="crowdImg3" value={formData.crowdImg3} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진3" />
                본문사진4: <input type="text" id="crowdImg4" value={formData.crowdImg4} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진4" />
                본문사진5: <input type="text" id="crowdImg5" value={formData.crowdImg5} onChange={handleInputChange} placeholder="수정하고자 하는 파일을 업로드 하세요. 본문사진5" />
            </form>
            <div id="submitBtn">
                <button type="submit">수정하기</button>
                <button>취소</button>
            </div>
        </div>
    );
}

export default CrowdUpdate;