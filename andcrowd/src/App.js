import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import AndList from './pages/AndList';
import CrowdList from './pages/CrowdList';
import Team from './pages/Team';
import Help from './pages/Help';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';

const sections = [
  { title: '홈', url: '/' },
  { title: '모임', url: '/and/list' },
  { title: '펀딩', url: '/crowd/list' },
  { title: '팀소개', url: '/team' },
  { title: '도움말', url: '/help' },
];

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const maxWidth = Math.min(1320, windowWidth * 0.7); // 최대 너비를 1320px 또는 창 너비의 90% 중 작은 값으로 설정

  return (
    <div className='App'>
      <div className="wrapper" style={{ maxWidth: `${maxWidth}px` }}>
        <Header title="&Crowd" sections={sections} />
        <div className="main-content">
          <Routes>
            <Route path="/user/1/and" element={<Test />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user/:userId" element={<MyPage />} />
            <Route path="/and/list" element={<AndList />} />
            <Route path="/and/create" element={<Login />} />
            <Route path="/crowd/list" element={<CrowdList />} />
            <Route path="/crowd/create" element={<Login />} />
            <Route path="/team" element={<Team />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
