export const GetUserInfo = (userId, setUserInfo) => {
    try{
        fetch(`/user/${userId}`, {
            method: "GET",
            headers:{
              'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
              'Content-Type': 'application/json; text=utf-8'
            }
        }).then(res => {
            if(!res.ok) throw new Error(`/user/${userId}: ${res}`);
            return res.json();
        }).then(data => {
            setUserInfo(data);
        });
    } catch(error){
        console.error("GetUserInfo: " + error);
    }
}