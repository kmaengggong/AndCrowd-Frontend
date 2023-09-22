import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../components/and/Editor";
import '../../styles/crowd/CrowdUpdate.css';

const CrowdUpdate = () => {
    const [htmlStr, setHtmlStr] = React.useState('');
    const params = useParams();
    const crowdId = params.crowdId;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: "",
        crowdCategoryId: "",
        crowdTitle: "",
        crowdContent: "",
        crowdEndDate: "",
        headerImg: "",
    });
    const [headerImg, setHeaderImg] = useState('');

    useEffect(() => {
        fetchCrowdData();
    }, []); // useEffect를 컴포넌트 렌더링 후 한 번만 실행되도록 설정

    const fetchCrowdData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}`);

            if (response.ok) {
                const data = await response.json();
                console.log('fetchCrowdData:', data);
                setFormData(data);
                setHeaderImg(data.headerImg);
                setHtmlStr(data.crowdContent);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("전달된 form:", formData);

        try {
            const response = await fetch(`/crowd/${crowdId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...formData, crowdContent: htmlStr}),
            });

            if(response.ok) {
                alert("수정완료 되었습니다.");
                navigate(`/crowd/${crowdId}`);
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCategoryChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [fileName, setFileName] = useState("");
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("crowdId", crowdId);
        formData.append("files", file);
        formData.append("fileType", "headerImg");
        if(file) {
            setFileName(file.name);
        } else {
            setFileName("");
        }
        try{
            const response = await fetch("/crowd/s3/uploads",{
                method: "POST",
                body: formData,
                headers: {
                    ACL: "public-read",
                },
            });
            if(response.ok) {
                const fileResponse = await response.json();
                const newUploadFileUrl = fileResponse[0].uploadFileUrl;
                setHeaderImg(newUploadFileUrl);
                console.log(newUploadFileUrl);
                console.log("Successfully uploaded");
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch(error) {
            console.error("Error uploading file:", error);
        }
    }

    const handleUploadCancel = () => {
        alert("작성이 취소되었습니다.");
        navigate(`/crowd/${crowdId}`); // 업로드 취소 버튼 클릭 시 페이지 전환
    };

    return (
       <>
        <div id="crowd-update-submit_btn-box">
            <button id="crowd-update-submit_btn" type="submit" onClick={handleSubmit}>저장</button>
            <button id="crowd-update-submit_btn" type="button" onClick={handleUploadCancel}>취소</button>
        </div>
        <form id="crowd-update-form" onSubmit={handleSubmit}>
            <div>
                카테고리:
                <select
                    name="crowdCategoryId"
                    value={formData.crowdCategoryId}
                    onChange={handleCategoryChange}
                    id="crowd-create-category"
                    required>
                        <option value="0">--카테고리 선택--</option>
                        <option value="1">문화/예술</option>
                        <option value="2">액티비티/스포츠</option>
                        <option value="3">테크/가전</option>
                        <option value="4">푸드</option>
                        <option value="5">언어</option>
                        <option value="6">여행</option>
                        <option value="7">반려동물</option>
                        <option value="8">기타</option>
                    </select>
                <input id="crowd-update-input" type="text" name="crowdTitle" value={formData.crowdTitle} onChange={handleInputChange} placeholder="수정될 제목을 입력하세요" />
                <input id="crowd-update-input" type="date" name="crowdEndDate" value={formData.crowdEndDate} onChange={handleDateChange} />
                <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
                <input type="file" id="file" accept="image/*" onChange={handleFileChange} />
                    {headerImg && <img id="crowd-update-img" src={headerImg} alt="Upload Image"/>}
            </div>
        </form>
       </>
    );
}

export default CrowdUpdate;