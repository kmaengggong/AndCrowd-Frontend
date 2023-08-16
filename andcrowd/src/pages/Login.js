import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onClickLogin = () => {
        console.log({email, password});
        fetch('/login', {
            method: "POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
                "userEmail": email,
                "userPassword": password
            }) 
        }).then(res => {
            console.log(res);
            if(res.status !== 200){
                alert("로그인 실패");
                return;

            }
            alert("로그인 성공!!!!!!!!!!!!");
            return res.json();
        }).then(data => console.log(data));
    }
  //   .then((res) => {
  //     console.log(res);
  //     return res.json();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     setMessage(data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // }, []);

    return (
      <div>
        E-mail: <input type="text" value={email} onChange={onChangeEmail} /><br />
        Password: <input type="password" value={password} onChange={onChangePassword} /><br />
        <button type="button" onClick={onClickLogin}>Log In</button>
      </div> 
    );
};

export default Login;