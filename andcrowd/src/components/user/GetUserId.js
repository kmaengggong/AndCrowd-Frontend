export const GetUserId = async () => {
    const accessToken = localStorage.getItem("access_token");
    
    try{
        const userId = await fetch('/api/getUserId', {
            method: "POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
                "accessToken": accessToken,
            })
        }).then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
            return data;
        })

        return userId;
    } catch(error){
        console.error("/api/getUserId: " + error);
    }
}