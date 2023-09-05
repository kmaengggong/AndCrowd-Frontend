import {useCookies} from "react-cookie";
import jwt_decode from 'jwt-decode';
import { GetUserId } from "../components/user/GetUserId";

const Test = () => {
  const [cookie, setCookie] = useCookies(['refresh_token']);  
  const onClickLogin = async () => {
      
      // console.log(localStorage.getItem("access_token"));
      // console.log(cookie.refresh_token);
      // console.log(jwt_decode(JSON.stringify(cookie)));
      console.log("result: " + await GetUserId());
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
      </div>  
    );
};

export default Test;