import React, { useEffect, useState } from 'react';
import API from "../API.js"
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image,  Button, Accordion, Card } from 'react-bootstrap';

const HistoryPage = (props) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [expandedGames, setExpandedGames] = useState({});
  const [ user, setUser ] = useState(()=>{
    return props.user || JSON.parse(localStorage.getItem('user'));
  });

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
        console.log("Unwanted Error");
      }
    }
  }, [user, setUser]);

  console.log("props ", props.user);
  console.log("user ", user);
  useEffect(() => {
    API.getGameHistory(user.user_id)
      .then(data => {
        console.log("ever executing ", data);
        setGameHistory(data);
      })
      .catch(error => {
        console.error('Error fetching game history:', error);
      });
  }, [user]);
  

  const toggleGameDetails = (gameId) => {
    setExpandedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };


  return (

   <>
   <div>
   <Button variant="secondary" onClick={() => navigate('/profile')}>
                Go Home
    </Button>
    </div>
  <Container className='history-container'>
      <h1>Game History</h1>
      {gameHistory.map((game) => (
        <div key={game.game_id}>
          <Row className="align-items-center">
            <Col xs={4}>
            </Col>
            <Col xs={6}>
              <h2>Game on {new Date(game.created_at).toLocaleString()}</h2>
              <p>Total Score: {game.total_score}</p>
            </Col>
            <Col xs={2}>
              <Button onClick={() => toggleGameDetails(game.game_id)}>
                {expandedGames[game.game_id] ? 'Hide Details' : 'Show Details'}
              </Button>
            </Col>
            
          </Row>
          {expandedGames[game.game_id] && (
            <div className="mt-3">
              <h3>Rounds:</h3>
              {game.rounds.map((round) => (
                <Row key={round.round_id} className="my-3">
                  <Col xs={8}>
                    <Image src={round.meme_image} fluid className="meme-image mb-4"/>
                  </Col>
                  <Col xs={8}>
                    <p>Caption: {round.caption_text}</p>
                    <p>Score: {round.score}</p>
                    <p>Correct: {round.is_correct ? 'Yes' : 'No'}</p>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </div>
      ))}
    </Container>
  
    </>

  )
  
};

export default HistoryPage;
