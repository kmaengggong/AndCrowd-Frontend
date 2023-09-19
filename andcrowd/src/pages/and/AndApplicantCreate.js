import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../styles/and/AndApplicantCreate.css'
import Editor from "../../components/and/Editor";
import { GetUserId } from '../../components/user/GetUserId'; 

const AndApplicantCreate = () => {
    const params = useParams();
    const andId = params.andId;
    const [htmlStr, setHtmlStr] = React.useState('');
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");

    const [andApplyFile, setAndApplyFile] = useState("");
    const [isUploading, setIsUploading] = useState(false); // 파일 업로드 상태

    const [formData, setFormData] = useState({
        andId: andId,
        andRoleId: "",
        andApplyTitle:"",
        andApplyContent: "",
    });

    // const yourAccessToken = Cookies.get('refresh_token');

    // const fetchData = async () => {
    //     try {
    //       const userIdResponse = await fetch(`/user-info/userid`,{
    //         method: 'GET',
    //         headers: {
    //           'Authorization': `Bearer ${yourAccessToken}`,
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       if (userIdResponse.ok) {
    //         const userId = await userIdResponse.json();
    //         setUserId(userId.userId);
    //       } else {
    //         throw new Error(`Fetching userId failed with status ${userIdResponse.status}.`);
    //       }
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //   };
    
    useEffect(() => {
      setUserId(GetUserId());
    }, []);
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const updatedFormData = {
      ...formData,
      userId: userId,
      andApplyFile: andApplyFile,
      andApplyContent:htmlStr
    };  

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("formdata:", formData);

        // 파일이 업로드되었는지 확인
        if (andApplyFile) {
            const response = await fetch(`/and/${andId}/applicant/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                navigate(`/and/${andId}/applicant/list`);
            } else {
                console.error(`Request failed with status ${response.status}`);
            }
        } else {
            console.error("파일이 업로드되지 않았습니다.");
        }
    };

    const handleFileChange = async (event) => {
      const file = event.target.files[0]; // 선택한 파일 가져오기  
      const formData = new FormData();
      formData.append("andId", andId); 
      formData.append("file", file); 
      formData.append("fileType", "applyFile");

      setIsUploading(true); // 파일 업로드 상태를 true로 설정
    
      try {
        const response = await fetch("/and/s3/upload", {
          method: "POST",
          body: formData,
          headers: {
            ACL: "public-read", // ACL 헤더 설정
          },
        });
    
        if (response.ok) {
          console.log("File uploaded successfully");
          
          const responseData = await response.json();
          
          const fileUrl = responseData.uploadFileUrl;
          console.log("Uploaded File URL:", fileUrl);
          setAndApplyFile(fileUrl);
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
            <form id='applicant-form'onSubmit={handleSubmit}>
                <div>
                  <input
                        type="file"
                        name="andApplyFile"
                        onChange={handleFileChange} // 파일 선택 시 handleFileChange 함수 호출
                    />
                    {isUploading ? (
                      <p>파일 첨부 중...</p>
                    ) : (
                      <button id='applicant-sub' type="submit">제출</button>
                    )}
                    <input id='applicant-input' type="text" name="userId" value={userId} readOnly />
                    <input id='applicant-input' type="text" name="andRoleId" value={formData.andRoleId} onChange={handleInputChange} placeholder="역할 번호" />
                    <input id='applicant-input' type="text" name="andApplyTitle" value={formData.andApplyTitle} onChange={handleInputChange} placeholder="제목" />
                    <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></Editor>
                    
                </div>
            </form>

        </>
    );
};
    
export default AndApplicantCreate;
