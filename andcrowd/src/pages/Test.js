import { useEffect, useState } from "react";
import { GetUserId } from "../components/user/GetUserId";
import { GetUserInfo } from "../components/user/GetUserInfo";
import { useNavigate } from "react-router";
import { Alert, Snackbar } from "@mui/material";

const Test = () => {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUserId(GetUserId());
  }, []);

  useEffect(() => {
    setUserEmail(userInfo.userEmail);
    setUserNickname(userInfo.userNickname);
  }, [userInfo]);

  const onClickTestButton = () => {
    // try{
    //   fetch(`/crowd/create`, {
    //     method: "POST",
    //     headers:{
    //       'Content-Type':'application/json; text=utf-8'
    //     },
    //     body: JSON.stringify({
    //       'crowdCategoryId':1,
    //       'crowdContent': "크라우드내용",
    //       'crowdEndDate': '2023-09-20T15:06:07.000000',
    //       'userId':1,
    //       'crowdTitle':'크라우드제목'
    //     })
    //   }).then(res => console.log(res));
    // } catch(error){
    //   console.error(error);
    // }
    setOpen(true);
  }

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <button type="button" onClick={onClickTestButton}>테스트</button>
      <Snackbar open={open} onClose={handleClose}>
      <Alert onClose={handleClose}>알러트</Alert>
      </Snackbar>
    </div>  
  );
};

export default Test;