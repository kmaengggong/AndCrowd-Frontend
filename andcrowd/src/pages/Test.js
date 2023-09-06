import { useEffect, useState } from "react";
import { GetUserId } from "../components/user/GetUserId";
import { GetUserInfo } from "../components/user/GetUserInfo";

const Test = () => {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState('');

  useEffect(() => {
    setUserId(GetUserId());
  }, []);

  useEffect(() => {
    setUserEmail(userInfo.userEmail);
    setUserNickname(userInfo.userNickname);
  }, [userInfo]);

  const onClickTestButton = () => {
    GetUserInfo(userId, setUserInfo);
  }

  return (
    <div>
      <button type="button" onClick={onClickTestButton}>테스트</button>
      <h1>로그인 된 유저 ID: {userId} </h1>
      <h1>로그인 된 유저 E-mail: {userEmail} </h1>
      <h1>로그인 된 유저 Nickname: {userNickname} </h1>
    </div>  
  );
};

export default Test;