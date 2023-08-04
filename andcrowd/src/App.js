import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Main from './components/Main';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';

function App() {
  // const [message, setMessage] = useState([]);

  // useEffect(() => {
  //   fetch('/hello')
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
    <div className='App'>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;