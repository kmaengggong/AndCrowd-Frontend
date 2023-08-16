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

function App() {
  return (
    <div className='App'>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/and/list" element={<Login />} />
        <Route path="/and/create" element={<Login />} />
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