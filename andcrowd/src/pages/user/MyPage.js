import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsLoginState } from "../../context/isLoginContext";
import { GetUserId } from "../../components/user/GetUserId";
import profileImg from "../and/cat.jpg";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import Logout from "../../components/sign/Logout";

const MyPage = () => {
    const params = useParams();
    const userId = params.userId;
    const isLogin = useIsLoginState();
    const [isOwner, setIsOwner] = useState(false);
    const [userAnd, setUserAnd] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userLike, setUserLike] = useState([]);

    // const [profileImg, setProfileImg] = useState('');

    const [openResignModal, setOpenResignModal] = useState(false);
    const handleOpenResignDialog = () => setOpenResignModal(true);
    const handleCloseResignDialog = () => setOpenResignModal(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        fetchIsUserExist();
        if(isLogin){
            if(parseInt(GetUserId()) === parseInt(userId)) setIsOwner(true);
        }
        fetchGetDynamicUserAnd();
        fetchGetDynamicUserOrder();
        fetchGetDynamicUserLike();
    }, []);

    const onUserInfoEditButtonClick = () => {
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

    const onClickResignYesButton = () => {
        navigate("/user/delete");
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
            <img src={profileImg} alt="프로필" style={{width: 100, height:100, borderRadius: 100/2 }} />
            <br />
            {isOwner ?
                <>
                    <Grid item xs={12} sm={9}>
                    <TextField
                            type="file"
                            fullWidth
                            name=""
                            // onChange={onProfileImgChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, mb: 1 }}
                            // onClick={uploadProfileImg}
                        >
                            프로필 사진 올리기
                        </Button>
                    </Grid>  
                    <Button>메이커 페이지</Button>
                    <Button>프로필 사진 수정</Button>
                    <Button onClick={onUserInfoEditButtonClick}>회원 정보 수정</Button>
                    <Button onClick={onClickPasswordChangeButton}>비밀번호 변경</Button>
                    <Button onClick={handleOpenResignDialog}>회원 탈퇴</Button>
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

            <Dialog
                open={openResignModal}
                onClose={handleCloseResignDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        회원 탈퇴
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            정말로 탈퇴하시겠습니까?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClickResignYesButton}>예</Button>
                        <Button onClick={handleCloseResignDialog}>아니오</Button>
                    </DialogActions>
            </Dialog>
        </>
    );
}

export default MyPage;