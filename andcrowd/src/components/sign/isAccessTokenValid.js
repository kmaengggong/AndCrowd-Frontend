// 토큰 검증 컴포넌트

export const isAccessTokenValid = () => {
    try{
        fetch('/api/accessTokenValid', {
            method: "POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
                "accessToken": localStorage.getItem('access_token')
            })
        }).then((res) => {
            // 엑세스 토큰 만료 시
            if(res.status !== 200){
                // 엑세스 토큰 삭제 후
                localStorage.removeItem('access_token');
                console.error("AccessToken is not Valid!");
                // 리프레쉬 토큰을 통해 엑세스 토큰 재발급 시도
                
            }
        })
    } catch(error){
        console.error("isAccessTokenValid: " + error);
    }
}