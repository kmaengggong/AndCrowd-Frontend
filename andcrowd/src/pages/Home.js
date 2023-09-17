import { useEffect, useState } from "react";
import { GetIsUserAdmin } from "../components/user/GetIsUserAdmin";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GetIsUserAdmin(setIsAdmin);
  }, []);

  useEffect(() => {
    if(isAdmin) navigate("/iamtheadmin");
  }, [isAdmin]);
}

export default Home;