import { useEffect, useState } from "react";
import { GetIsUserAdmin } from "../components/user/GetIsUserAdmin";
import { useNavigate } from "react-router-dom";
import { useIsLoginState } from "../context/isLoginContext";
import { GetUserId } from "../components/user/GetUserId";

const Home = () => {
  const isLogin = useIsLoginState();
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(isLogin){
      setUserId(GetUserId());
    }
  }, []);

  useEffect(() => {
    if(userId !== null){
      GetIsUserAdmin(setIsAdmin);
    }
  }, [userId]);

  useEffect(() => {
    if(isAdmin) navigate("/iamtheadmin");
  }, [isAdmin]);
}

export default Home;