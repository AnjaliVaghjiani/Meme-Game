import React , {useContext, useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import API from "../API"

const ProfilePage = (props) => {
  const [ user, setUser ] = useState(()=>{
    return props.user || JSON.parse(localStorage.getItem('user'));
  });
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();


  


  useEffect(() => {
    if (props.user) {
      localStorage.setItem('user', JSON.stringify(props.user));
      setUser(props.user);
    }else{
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        navigate('/login');
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    if (props.user && props.user.user_id) {
      fetchUserTotalScore(props.user.user_id);
    }
  }, [user]);

  const fetchUserTotalScore = async (userId) => {
    try {
      const s = await API.getUserTotalScore(userId);
      setTotalScore(s);
    } catch (error) {
      console.error('Error fetching user total score:', error);
    }
  };


  const handlePlayGame = () => {
    navigate('/game');
  };

  const handleReviewHistory = () => {
    navigate('/history');
  };
 
  const handleLogout = () => {
    API.logout().then(() => {
      setUser(null);
      props.logout();
      navigate('/login');
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <Container className='profile-container'>
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="text-center">
          <h1>Welcome, {user.username}</h1> 
          <div>
            <h2>{user.username}'s Total Score is : {totalScore}</h2>
          </div>
          <p>Select an option below:</p>
          <div className='play-button-prof'>
          <Button variant="primary" onClick={handlePlayGame} className="m-2">
            Play Game
          </Button>
          </div>
          <div className='play-button-prof'>
          <Button variant="secondary" onClick={handleReviewHistory} className="m-2">
            Review History
          </Button>
          </div>
          <div className='play-button-prof'>
          <Button variant="danger" onClick={handleLogout} className="m-2">
            Logout
          </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
