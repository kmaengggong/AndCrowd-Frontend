import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import AndList from './pages/AndList';
import AndDetail from './pages/and/AndDetail';
import AndQna from './pages/and/AndQna';
import AndQnaDetail from './pages/and/AndQnaDetail';
import AndCreate from './pages/and/AndCreate';
import AndUpdate from './pages/and/AndUpdate';
import AndQnaCreate from './pages/and/AndQnaCreate';
import AndQnaUpdate from './pages/and/AndQnaUpdate';
import AndScroll from './pages/and/AndScroll';
import AndReplyUpdate from './pages/and/AndReplyUpdate';
import AndReplyCreate from './pages/and/AndReplyCreate';


function App() {
  return (
    <div className='App'>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/and/list" element={<AndList />} />
        <Route path="/and/scroll/:categoryId/:andStatus/:sortField/:sortOrder" element={<AndScroll />} />
        <Route path="/and/:andId" element={<AndDetail />} />
        <Route path="/and/:andId/update" element={<AndUpdate />} />
        <Route path="/and/:andId/qna/list" element={<AndQna />} />
        <Route path="/and/:andId/qna/create" element={<AndQnaCreate />} />
        <Route path="/and/:andId/qna/:andQnaId" element={<AndQnaDetail />} />
        <Route path="/and/:andId/qna/:andQnaId/update" element={<AndQnaUpdate />} />
        <Route path="/and/:andId/qna/reply/:andQnaId/:andQnaReplyId/update" element={<AndReplyUpdate />} />
        <Route path="/and/:andId/qna/reply/:andQnaId/create" element={<AndReplyCreate />} />
        <Route path="/and/create" element={<AndCreate />} />
        <Route path="/crowd/list" element={<Login />} />
        <Route path="/crowd/create" element={<Login />} />
        <Route path="/team" element={<Login />} />
        <Route path="/help" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;