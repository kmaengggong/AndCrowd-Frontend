import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const CrowdCreateImg = () => {
    const navigate = useNavigate();
    const params = useParams();
    const crowdId = params.crowdId;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("crowdId", crowdId);
        formData.append("files", file);
        formData.append("fileType", "headerImg");

        try{
            const response = await fetch("/crowd/s3/uploads", {
                method: "POST",
                body: formData,
                headers: {
                    ACL: "public-read",
                },
            });
            if(response.ok) {
                console.log("File uploaded successfully");
            } else {
                throw new Error(`${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNextButtonClick = async () => {
        alert();
        navigate(``)
    }

    return(
        {/* 이미지 업로드 부분 */}
    );
};

export default CrowdCreateImg;