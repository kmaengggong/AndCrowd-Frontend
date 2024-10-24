import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AndApplicantUpdate = () => {
    const params = useParams();
    const andId = params.andId;
    const andApplyId = params.andApplyId;

    const navigate = useNavigate();

    const [andApplyFile, setAndApplyFile] = useState('');
    const [isUploading, setIsUploading] = useState(false); // 파일 업로드 상태
    
    const [formData, setFormData] = useState({
        andId: andId,
        userId: "",
        andRoleId: "",
        andApplyTitle: "",
        andApplyContent: "",
        andApplyStatus: "",
    });

    useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          const response = await fetch(`/and/${andId}/applicant/${andApplyId}`);
          
          if (response.ok) {
            const data = await response.json();
            setFormData(data);
            setAndApplyFile(data.andApplyFile);
          } else {
            navigate("/NotFound");
            throw new Error(`Fetching and data failed with status ${response.status}.`);
          }
    
        } catch (error) {
          console.error("Error fetching And Qna data:", error);
        }
      };

    const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
        ...formData,
        [name]: value,
    });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("formdata:", formData);

            const response = await fetch(`/and/${andId}/applicant/${andApplyId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            navigate(`/and/${andId}/applicant/list`);
    };

    useEffect(() => {
      // formData가 업데이트될 때마다 실행됩니다.
      console.log("formData 업데이트 후: ", formData);
    }, [formData]); // formData가 변경될 때만 실행

    const handleFileChange = async (event) => {
      const file = event.target.files[0]; // 선택한 파일 가져오기  
      console.log(file);
      const formData = new FormData();
      formData.append("andId", andId); // andId 값을 추가
      formData.append("file", file); // 파일을 폼 데이터에 추가
      formData.append("fileType", "applyFile");

      setIsUploading(true); // 파일 업로드 상태를 true로 설정
    
      try {
        const response = await fetch("/and/s3/upload", {
          method: "POST",
          body: formData, // 폼 데이터를 전송합니다.
          headers: {
            ACL: "public-read", // ACL 헤더를 설정합니다.
          },
        });
    
        if (response.ok) {
          // 성공적으로 업로드 및 처리되었을 때의 코드
          console.log("File uploaded successfully");
          // 서버에서 응답 데이터를 JSON으로 파싱
          const responseData = await response.json();

          const fileUrl = responseData.uploadFileUrl;
          console.log("Uploaded File URL:", fileUrl);

          setFormData((prevData) => ({
            ...prevData,
            andApplyFile: fileUrl,
          }));

        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false); // 파일 업로드가 완료되면 상태를 false로 설정
      }
    };

    

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="회원번호" />
                    <input type="text" name="andRoleId" value={formData.andRoleId} onChange={handleInputChange} placeholder="역할 번호" />
                    <input type="text" name="andApplyTitle" value={formData.andApplyTitle} onChange={handleInputChange} placeholder="제목" />
                    <input type="text" name="andApplyContent" value={formData.andApplyContent} onChange={handleInputChange} placeholder="내용" />
                    <input
                        type="file"
                        name="andApplyFile"
                        onChange={handleFileChange} // 파일 선택 시 handleFileChange 함수 호출
                    />
                    {isUploading ? (
                      <p>파일 첨부 중...</p>
                    ) : (
                      <button type="submit">제출</button>
                    )}
                </div>
            </form>

        </>
    );
};
    
export default AndApplicantUpdate;