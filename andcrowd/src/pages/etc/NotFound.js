import '../../styles/NotFound.css'
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };
    return (
      <div id='nf-div'>
        <img id='not-found-img' src="/nfImg.jpg" alt="nfImg"  />
        <p id='not-found-txt'>페이지를 찾을 수 없어요!</p>
        <button id='go-to-home' onClick={goToHome}>홈으로 돌아가기</button>
      </div>  
    );  
};

export default NotFound;