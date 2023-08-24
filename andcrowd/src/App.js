import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import Signup from './pages/Signup';

const sections = [
  {title: '홈', url: ''},
  {title: '모임', url: 'and/list'},
  {title: '펀딩', url: 'crowd/list'},
  {title: '팀소개', url: 'team'},
  {title: '도움말', url: 'help'},
];

function App() {
  return (
    <div className='App'>
      <Header title="&Crowd" sections={sections} />
      <Navigation />
      <Routes>
        <Route path="/user/1/and" element={<Test />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/and/list" element={<Login />} />
        <Route path="/and/create" element={<Login />} />
        <Route path="/crowd/list" element={<Login />} />
        <Route path="/crowd/create" element={<Login />} />
        <Route path="/team" element={<Login />} />
        <Route path="/help" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer
        title="&Crowd"
        description="you And me make a Crowd"
      />
    </div>
  );
}

export default App;