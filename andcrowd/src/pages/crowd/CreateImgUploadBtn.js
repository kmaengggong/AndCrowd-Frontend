import React, { useState } from "react";
import { Button, Input } from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";

const CreateImgUploadBtn = ({ fileType, handleFileChange }) => {

    const [previewImage, setPreviewImage] = useState(null);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileChange(e, fileType); // 이미지 업로드 처리
            // 이미지 미리보기를 위해 FileReader 사용
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Button
                onClick={() => {
                    const inputElement = document.createElement("input");
                    inputElement.type = "file";
                    inputElement.accept = "image/*";
                    inputElement.style.display = "none";
                    inputElement.onchange = (e) => handleFileChange(e, fileType);
                    inputElement.click();
                }}
                variant="contained"
                startIcon={<AiOutlineCloudUpload />}
                style={{ margin: "5px" }}
            >
                {fileType === "headerImg" ? "Header Image 업로드" : `본문 이미지 ${fileType} 업로드`}
            </Button>
            <Input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
            />
            {previewImage && (
                <div>
                    <img src={previewImage} alt="Image Preview" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                </div>
            )}
        </div>
    );
};

export default CreateImgUploadBtn;