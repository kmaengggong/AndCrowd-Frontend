const Test = () => {
    const onClickLogin = () => {
        fetch('/user/1/and', {
            method: "GET"}).then(res => {
            console.log(res);
            if(res.status !== 200){
                alert("로그인 실패");
                return;

            }
            alert("로그인 성공!!!!!!!!!!!!");
            return res.json();
        }).then(data => console.log(data));
    }

    return (
      <div>
        <button type="button" onClick={onClickLogin}>Log In</button>
      </div>  
    );
};

export default Test;