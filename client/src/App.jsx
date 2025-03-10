import { useEffect, useState } from 'react'
import API from '../src/API'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Navigate} from 'react-router-dom'
import HomePage from './Components/Home'
import GamePage from './Components/GamePage'
import HistoryPage from './Components/HistoryPage'
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/Profile';
import GuestGamePage from './Components/GuestPage'; // Import the new component


function App() {
  const [count, setCount] = useState(0)
  const [userdata, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    login();
  },[]);

  const login = (userData) => {
    // console.log("an i getting correct userData ", userData);

    setLoggedIn(true);
    if(userData){
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }else{
      const d = localStorage.getItem('user');
      if(d){
        setUser(JSON.parse(d));

      }else{
        console.log("errro getting user data")
      }
    }
   
  };



  const logout = () => {
    setLoggedIn(false);
    setUser(null);
  };


  return (
    <>
   
       <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage login={login}/>} />
        <Route path="/game" element={<GamePage user={userdata}/>} />
        <Route path="/history" element={<HistoryPage user={userdata}/>} />
        {/* <Route path="/profile" element={<ProfilePage user={user} logout={logout}/>} /> */}
        <Route path="/profile" element={ <ProfilePage user={userdata} logout={logout}/>} />
        <Route path="/guest-game" element={<GuestGamePage />} /> 
      </Routes>
      
    </>
  )
}

export default App
