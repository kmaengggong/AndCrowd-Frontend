import {Link} from 'react-router-dom';

const Login = () => {
    return (
      <div>
        <form method="POST">
            ID: <input type="text" /><br />
            PW: <input type="password" /><br />
            <button type="submit">Log In</button>
        </form>
      </div> 
    );
};

export default Login;