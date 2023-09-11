import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsLoginState } from "../../context/isLoginContext";
import { GetUserId } from "../../components/user/GetUserId";
import profileImg from "../and/cat.jpg";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import Logout from "../../components/sign/Logout";
import { GetUserInfo } from "../../components/user/GetUserInfo";

const MyPage = () => {
    const params = useParams();
    const userId = params.userId;
    const [userInfo, setUserInfo] = useState([]);
    const isLogin = useIsLoginState();
    const [isOwner, setIsOwner] = useState(false);
    const [userAnd, setUserAnd] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userLike, setUserLike] = useState([]);

    const navigate = useNavigate();
    
    useEffect(() => {
        if(userId !== null){
            GetUserInfo(userId, setUserInfo);
        }
    }, [userId]);

    useEffect(() => {
        fetchIsUserExist();
        if(isLogin){
            if(parseInt(GetUserId()) === parseInt(userId)) setIsOwner(true);
        }
        fetchGetDynamicUserAnd();
        fetchGetDynamicUserOrder();
        fetchGetDynamicUserLike();
    }, []);

    const onClickProfileImgEditButton = () => {
        navigate(`/user/profileImgEdit`);
    }

    const onClickUserInfoEditButtonButton = () => {
        navigate(`/user/update`);
    };

    // const onProfileImgChange = (event) => {
    //     // const file = event.target.files[0];
    //     // const imageUrl = URL.createObjectURL(file);
    //     // setProfileImg(imageUrl);
    //     // setProfileImg(Array.from(event.target.files));
    //     event.preventDefault();
    //     const formData = new FormData();
    //     formData.append("file", event.target.files[0]);
    //     setProfileImg(formData);
    // }

    // const uploadProfileImg = (event) => {
    //     event.preventDefault();
    //     // const formData = new FormData();
    //     // profileImg.map((file) => {
    //     //     formData.append("files", file);
    //     // });
    //     // console.log(Array.from(formData));

    //     try{
    //         // fetch('http://localhost:3000/file/uploads', {
    //         //     method: "POST",
    //         //     headers: {
    //         //         "Content-Type": 'multipart/form-data'
    //         //     },
    //         //     body: formData
    //         // }).then((res) => {
    //         //     console.log(res.data);
    //         // })
    //     } catch(error){
    //         console.error("uploadProfileimg: " + error);
    //     }
    // }

    const onClickPasswordChangeButton = () => {
        navigate("/user/passwordChange");
    }

    const fetchIsUserExist = async () => {
        try{
            await fetch(`/user/${userId}`)
            .then(res => {
                if(res.status !== 200){
                    navigate("/NotFound");
                }
            });
        } catch(error){
            console.error(`/${userId}: ${error}`);
        }
    };

    const fetchGetDynamicUserAnd = async () => {
        try{
            await fetch(`/user/${userId}/and`)
            .then(res => {
                return res.json();
            }).then(data => {
                console.log(data);
                setUserAnd(data);
            })
        } catch(error){
            console.error(`/user/${userId}/and: ${error}`);
        }
    };

    const fetchGetDynamicUserOrder = async () => {
        try{
            await fetch(`/user/${userId}/order`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserOrder(data);
            })
        } catch(error){
            console.error(`/user/${userId}/order: ${error}`);
        }
    };

    const fetchGetDynamicUserLike = async () => {
        try{
            await fetch(`/user/${userId}/like`)
            .then(res => {
                return res.json();
            }).then(data => {
                setUserLike(data);
            })
        } catch(error){
            console.error(`/user/${userId}/like: ${error}`);
        }
    };

    return (
        <>
            <br />
            <Avatar src={userInfo.userProfileImg} sx={{width: 100, height: 100}} />
            <br />
            {isOwner ?
                <>
                    <Button>메이커 페이지</Button>
                    <Button onClick={onClickProfileImgEditButton}>프로필 사진 수정</Button>
                    <Button onClick={onClickUserInfoEditButtonButton}>회원 정보 수정</Button>
                    <Button onClick={onClickPasswordChangeButton}>비밀번호 변경</Button>
                </>
                :
                <></>
            }
            <hr />
            <h1>참여한 모임</h1>
            <button>자세히</button>
            {userAnd.length === 0 ?
                <h2>비어있습니다.</h2>
                :
                <>
                    {userAnd.map((card) => (
                        <>
                            {card.andHeaderImg !== null ?
                            <img src={card.andHeaderImg} alt="헤더 이미지" width={600}/>
                            :
                            <img src="https://picsum.photos/id/2/600/400" alt="임시 이미지" />
                            }
                            <h2>타이틀:{card.andTitle}</h2>
                            <h2>컨텐츠:{card.andContent}</h2>
                        </>
                    ))}
                </>
            }
            <hr />
            <h1>후원한 펀딩</h1>
            <button>자세히</button>
            {userOrder.length === 0 ?
                <h2>비어있습니다.</h2>
                :
                <>
                    {userOrder.map((card) => (
                        <>
                            <h2>{card.orderTitle}</h2>
                            <h2>{card.orderContent}</h2>
                        </>
                    ))}
                </>
                
            }
            <hr />
            <h1>찜한 목록</h1>
            <button>자세히</button>
            {userLike.length === 0 ?
                <h2>비어있습니다.</h2>
                :
                <>
                    {userLike.map((card) => (
                        <>
                            <h2>{card.projectTitle}</h2>
                            <h2>{card.projectContent}</h2>
                        </>
                    ))}
                </>
            }
        </>
    );
}

export default MyPage;