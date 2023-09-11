import { useEffect, useState } from "react";
import { GetUserId } from "../../components/user/GetUserId";
import Logout from "../../components/sign/Logout";

const UserResign = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        setUserId(GetUserId());
    }, [])

    try{
        fetch(`/user/${userId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json; text=utf-8'
            }
        }).then(res => {
            if(res.ok){
                Logout();
                alert("회원 탈퇴가 완료되었습니다.");
            }
        })
    } catch(error){
        console.error("onClickResignYesButton: " + error);
    }
}

export default UserResign;