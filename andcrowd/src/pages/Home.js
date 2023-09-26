import { useEffect, useState } from "react";
import { GetIsUserAdmin } from "../components/user/GetIsUserAdmin";
import { useNavigate } from "react-router-dom";
import { useIsLoginState } from "../context/isLoginContext";
import { GetUserId } from "../components/user/GetUserId";
import '../styles/Home.css'
import Panorama from "./Panorama";
import Panorama2 from "./Panorama2";
import Panorama3 from "./Panorama3";
import Panorama4 from "./Panorama4";
import PanoramaC from "./PanoramaC";
import PanoramaC2 from "./PanoramaC2";
import PanoramaC3 from "./PanoramaC3";
import PanoramaC4 from "./PanoramaC4";

const TypewriterText = ({ text, delay }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [text, delay, currentIndex]);

  return <p id='first-text'>{displayText}</p>;
};

const Home = () => {
  const isLogin = useIsLoginState();
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [isInitialPage, setIsInitialPage] = useState(true);
  const [divBottom, setDivBottom] = useState(-window.innerHeight);

  const handleScroll = () => {
    const scrolledPixels = window.scrollY;
    setDivBottom(scrolledPixels - window.innerHeight);
  };
  useEffect(() => {
    if (isInitialPage) {
      setTimeout(() => {
        setIsInitialPage(false);
      }, 500);
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isInitialPage]);

  const yOffset = Math.max(0, divBottom);
  const textY = -1-(divBottom/200); 
  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: 0,
        size: 4,
        andCategoryId: '',
        andStatus: 1,
        sortField: 'andViewCount',
        sortOrder: "desc",
        searchKeyword: '',
      });
      const response = await fetch(`/and/scroll?${params.toString()}`);
      const jsonData = await response.json();
      const dataArray = jsonData.data;
      console.log(dataArray);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (isLogin) {
      setUserId(GetUserId());
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      GetIsUserAdmin(setIsAdmin);
    }
  }, [userId]);

  useEffect(() => {
    if (isAdmin) {
      navigate("/iamtheadmin");
    }
  }, [isAdmin]);

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div id="home-cont">
      
      <div
          className="fixed-yellow-div"
          style={{
            top: `calc(30px - ${yOffset}px)`
          }}
          
        >
          <img  id='mainI' src="mainI.jpg" alt="임시 이미지" loading="lazy" style={{ width: textY*550 }}/>
          <TypewriterText
            text="What's &Crowd?"
            delay={100}
          />
          <TypewriterText
            text="&Crowd는 소모임(&)과 크라우드(Crowd) 펀딩이 합쳐진 서비스입니다."
            delay={80}
          />
        
        </div>
        <div
          className="scrolling-div"
          style={{
            bottom: divBottom
          }}
        >
          <p id='home-sub-txt'>
            어려운 과목을 혼자 공부하고 계신가요? <br></br>
            소규모 게임을 만들고 싶나요? <br></br>
            아니면, 새로운 취미가 생겼나요?<br></br>

            꼭 혼자 할 필요는 없습니다!<br></br>

            혼자서는 어려웠던 공부도,<br></br> 시간이 부족해 만들지 못한 게임도, <br></br>재미가 반감된 새 취미도

            다른 누군가와 함께 하면 더 재밌습니다!<br></br><br></br>
          </p>
          <div id='home-s-t'>
          <p id='home-sub-txt2'>지금 인기있는 모임을 확인해보세요!
          </p>
          <div id='panorama-flex'>
            
            <Panorama></Panorama>
            <Panorama2></Panorama2>
            <Panorama3></Panorama3>
            <Panorama4></Panorama4>
          </div>
          </div>
      
      <p id='home-sub-txt3'>
      모임 활동 도중 문득 펀딩이 필요하신가요? <br></br>
      아니면, 그냥 문득 기발한 아이디어가 떠올랐나요?<br></br>

      열심히 모임 활동을 하는 것도 좋습니다. <br></br>
      하지만 그 결과를 다른 사람들에게도 알리고 싶다면? <br></br>
      펀딩도 같이 진행해보세요.


        </p>
        <p id='home-sub-txt2'>지금 인기있는 펀딩을 확인해보세요!
          </p>
        <div id='panorama-flex'>
            <PanoramaC></PanoramaC>
            <PanoramaC2></PanoramaC2>
            <PanoramaC3></PanoramaC3>
            <PanoramaC4></PanoramaC4>
          </div>
        </div>
        
        
        
      </div>
      
    </div>
    
  );
};

export default Home;
