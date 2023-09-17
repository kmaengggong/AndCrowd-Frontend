import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CrowdBoardUpdate = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdBoardId = params.crowdBoardId;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        crowdId: crowdId,
        crowdBoardId: crowdBoardId,
        crowdBoardTitle: "",
        crowdBoardContent: "",
    });

    useEffect(() =>{
        fetchBoardData();
    }, []);

    const fetchBoardData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/board/${crowdBoardId}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
            }else {
                throw new Error(`Fetching CrowdBoard data failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("게시물 데이터를 불러오는 중 오류 발생!", error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("formdata:",formData);
        const response = await fetch(`/crowd/${crowdId}/board/${crowdBoardId}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        navigate(`/crowd/${crowdId}/board/${crowdBoardId}`);
    };

    const handleUpdateCancleBtn = () => {
        // 수정 취소 버튼을 클릭했을 때 이전 페이지로 이동
        alert("수정이 취소되었습니다.")
        navigate(`/crowd/${crowdId}/board/all`);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                펀딩 번호: <input
                    type="text"
                    name="userId"
                    value={formData.crowdId}
                    onChange={handleInputChange}
                    placeholder="펀딩 번호"
                    readOnly
                /> <br />
                제목: <input
                    type="text"
                    name="crowdBoardTitle"
                    value={formData.crowdBoardTitle}
                    onChange={handleInputChange}
                    placeholder="제목"
                /> <br />
                내용: <input
                    type="text"
                    name="crowdBoardContent"
                    value={formData.crowdBoardContent}
                    onChange={handleInputChange}
                    placeholder="내용"
                />
                <button type="submit">수정하기</button>
            </form>
            <button type="button" onClick={handleUpdateCancleBtn}>등록 취소</button>
        </div>
    );
}

export default CrowdBoardUpdate;
