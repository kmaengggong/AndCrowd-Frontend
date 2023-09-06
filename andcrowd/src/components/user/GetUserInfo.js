export const GetUserInfo = (userId, setUserInfo) => {
    fetch(`/user/${userId}`, {
        method: "GET",
        headers:{
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Content-': 'application/json; text=utf-8'
        }
    }).then(res => {
        if(!res.ok) throw new Error(`/user/${userId}: ${res}`);
        return res.json();
    }).then(data => {
        setUserInfo(data);
    });
}