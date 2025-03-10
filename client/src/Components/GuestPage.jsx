import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import '../App.css';

const GuestGamePage = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [randomImage, setRandomImage] = useState(null);
  const [imageCaptions, setImageCaptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRandomImage();
  }, []);

  const fetchRandomImage = () => {
    API.getRandomImage()
      .then(image => {
        setRandomImage(image);
        return API.getImageCaptions(image.memeId); // Assuming image.memeId is used to fetch captions
      })
      .then(captions => {
        setImageCaptions(captions);
      })
      .catch(error => {
        console.error('Error fetching random image or captions:', error);
      });
  };

  useEffect(() => {
    if (showResults) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleEndRound();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showResults]);

  const handleCaptionClick = (captionId) => {
    API.validateCaption(randomImage.memeId, captionId)
      .then(response => {
        const { isCorrect } = response;
        if (isCorrect) {
          setScore(5);
        } else {
          setScore(0); // Set score to 0 for wrong answer
        }
        setSelectedCaption('');
        handleEndRound();
      })
      .catch(error => {
        console.error('Error validating caption:', error);
      });
  };

  const handleEndRound = () => {
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    setScore(0);
    setShowResults(false);
    fetchRandomImage();
  };

  if (!randomImage) {
    return <div>Loading...</div>;
  }

  if (showResults) {
    return (
      <Container className="game-page">
        <Row className="justify-content-center">
          <Col xs={12} md={8} className="text-center">
            <h1>Game Over</h1>
            <p>Your final score is: {score}</p>
            <Button variant="primary" onClick={handlePlayAgain} className="m-2">
              Play Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')} className="m-2">
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
    
    <Container className="game-page">
      <Container className = "get-Meme">
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={8} className="text-center">
          <Image src={randomImage.url} fluid className="meme-image" />
          <p>Time remaining: {timer} seconds</p>
        </Col>
      </Row>
      </Container>
      <Container className='allcaption'>
      <h3>Select The Options</h3>
      <Row className="justify-content-center">
        
        {imageCaptions.map((caption) => (
          <Col Col xs={12} md={6} lg={4} key={caption.captionId}>
            <Button
              variant={selectedCaption === caption.captionId ? 'primary' : 'outline-primary'}
              className="caption-button"
              onClick={() => handleCaptionClick(caption.captionId)}
              disabled={!!selectedCaption}
            >
              {caption.text}
            </Button>
          </Col>
        ))}
      </Row>
      </Container>
    </Container>
    </>

  );
};

export default GuestGamePage;
