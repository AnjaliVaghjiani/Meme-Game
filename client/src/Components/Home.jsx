// src/pages/HomePage.js
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Navbar, Nav, Container, Button, Image, Row, Col } from 'react-bootstrap';
import '../App.css';


const HomePage = () => {
    const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handlePlayAsGuest = () => {
    navigate('/guest-game'); 
  };

  return (
   
    <div className="homepage" >
        <Container className="hero-section d-flex flex-column justify-content-center align-items-center">
            <div>
            <h1 className="hero-title">MEME GAME</h1>
            <h2 className='caption'>Caption The Laugh </h2>
            </div>
            <div className="button-group">
                <Button variant="light" className="login-button" onClick={handleLogin}>Login</Button>
                <Button variant="outline-light" className="play-button" onClick={handlePlayAsGuest}>Play As Guest</Button>
            </div>
        </Container>
    </div>
    
);
};

export default HomePage;
