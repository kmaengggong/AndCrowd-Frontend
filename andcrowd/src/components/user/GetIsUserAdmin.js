export const GetIsUserAdmin = (setIsAdmin) => {
    try{
        fetch(`/api/isAdmin`, {
            method: "GET",
            headers:{
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json; text=utf-8'
            }
        }).then(res => {
            if(!res.ok) throw new Error("GetIsUserAdmin error");
            return res.json();
        }).then(data => {
            setIsAdmin(data);
        });
    } catch(error){
        console.error("GetUserInfo: " + error);
    }
}