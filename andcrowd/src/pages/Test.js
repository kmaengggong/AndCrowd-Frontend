import {useCookies} from "react-cookie";
import jwt_decode from 'jwt-decode';
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

  const onClickLogin = () => {
    GetUserInfo(userId, setUserInfo);
    // fetch(`/user/${userId}`, {
    //   method: "GET",
    //   headers:{
    //     'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
    //     'Content-': 'application/json; text=utf-8'
    //   }
    // }).then(res => {
    //   console.log(res);
    //   if(!res.ok) throw new Error(`/user/${userId}: ${res}`);
    //   return res.json();
    // }).then(data => {
    //   console.log(data);
    //   setUserEmail(data.userEmail);
    //   setUserNickname(data.userNickname);
    // });


      // console.log(localStorage.getItem("access_token"));
      // console.log(cookie.refresh_token);
      // console.log(jwt_decode(JSON.stringify(cookie)));
      // setUserId(GetUserId());
      // setUserEmail();
        // fetch('/user/2/and', {
        //     method: "GET"
        //   }).then(res => {
        //     console.log(res);
        //     if(res.status === 401){
        //       fetch('/api/token', {
        //         method: "POST",
        //         headers
        //       })
        //     }
        //     if(res.status !== 200){
        //         alert("로그인 실패");
        //         return;

        //     }
        //     alert("로그인 성공!!!!!!!!!!!!");
        //     return res.json();
        // }).then(data => console.log(data));
    }

    return (
      <div>
        <button type="button" onClick={onClickLogin}>테스트</button>
        <h1>로그인 된 유저 ID: {userId} </h1>
        <h1>로그인 된 유저 E-mail: {userEmail} </h1>
        <h1>로그인 된 유저 Nickname: {userNickname} </h1>
      </div>  
    );
};

export default Test;