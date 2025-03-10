import React, { useEffect, useState , useRef} from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import API from "../API.js"
 const SERVER_URL = 'http://localhost:3001'

const GamePage = (user) => {
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [randomImage, setRandomImage] = useState(null);
    const [imageCaptions, setImageCaptions] = useState([]);
    const [shownImages, setShownImages] = useState(new Set());
    const [roundResults, setRoundResults] = useState([]);
    const [bestCaptions, setBestCaptions] = useState([]);
    const [gameId, setGameId] = useState('');
    const [user_id, setUser] = useState(null);
    const scoreRef = useRef(score);
    const [gameSaved, setGameSaved] = useState(false);
    const [flag, setflag] = useState(0);
    const [tmpData, setTmpData] = useState([]);
    const navigate = useNavigate();


    useEffect(()=>{
     
      startNewGame(user);

    }, [user]);

    
  

    const startNewGame=(user) => {
      // console.log("in start game ", user.user.user_id);
      setUser(user.user.user_id);
      setShownImages(new Set());
      setBestCaptions([]);
      setTimer(30);
      
      API.startNewGame(user.user.user_id).then(response => {
          // console.log("what is response ", response);
          setGameId(response.gameId);
          // console.log("game id is ", gameId);
          fetchRandomImage();
      }).catch(error => {
          console.error('Error starting new game:', error);
      });
  };
  
  
  
    const fetchRandomImage = () => {
       API.getRandomImage()
      .then(image => {
        if (shownImages.has(image.memeId)) {
          fetchRandomImage();
        } else {
          setRandomImage(image);
          setShownImages(prev => new Set(prev).add(image.memeId));
          return API.getImageCaptions(image.memeId);
        }
      })
      .then(captions => {
        if (captions) {
          setImageCaptions(captions);
        }
      })
      .catch(error => {
        console.error('Error fetching random image or captions:', error);
      });
    };
   

 
    useEffect(() => {

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleNextRound();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentRound]);


 

  const handleCaptionClick = (image, captionId) => {
    storeRoundData(image, captionId);
  };

  const fetchBestCaptions = (image) => {
    try {
      // console.log("what is image ia ma getting to get caption ", image);
      API.getBestCaptions(image).then(i=>{
      setBestCaptions(i.bestCaptions);
      const tmp = i.bestCaptions;
       
        setRoundResults(prev => [
              ...prev,
              {
                meme: randomImage,
                caption: tmp,
                isCorrect: false,
                roundScore: 0,
              }
            ]);
      return i.bestCaptions;
    })
    } catch (err) {
      console.error('Error fetching best captions:', err);
      return [];
    }
  };

 

  const storeRoundData = async (image, captionId) => {
    try {
      // console.log("what is image", image);
      const response = await API.validateCaption(image.memeId, captionId);
      const { isCorrect } = response;
      const roundScore = isCorrect ? 5 : 0;
  
      if (isCorrect) {
        setScore(prev => {
          const newScore = prev + 5;
          scoreRef.current = newScore;
          return newScore;
        });
        const tmp = imageCaptions.find(a => a.captionId === captionId);
        setRoundResults(prev => [
          ...prev,
          {
            meme: image,
            caption: tmp.text,
            isCorrect,
            roundScore,
          }
        ]);
      } else {
        fetchBestCaptions(image.memeId);
        setBestCaptions([]);
      }
  
      const roundData = {
        gameId: gameId,
        memeId: image.memeId,
        selectedCaptionId: captionId,
        isCorrect: isCorrect,
        score: roundScore,
        completedAt: new Date().toISOString(),
      };
  
      await API.saveRound(roundData);
      // console.log('Game results saved successfully.');
  
      handleNextRound();
  
    } catch (error) {
      console.error('Error processing the round:', error);
    }
  };
  
  const handleNextRound = () => {
    
    if (currentRound + 1 >= 3) {
      
      saveGameResults(user_id);
      setShowResults(true);
      return;
    }
    setCurrentRound(prev => prev + 1);
    setTimer(30);
    fetchRandomImage();
    }
  

  const handlePlayAgain = () => {
    setCurrentRound(0);
    setGameId(null);
    setScore(0);
    setShowResults(false);
    setShownImages(new Set());
    setRoundResults([]);
    setGameSaved(false);
    startNewGame(user);
  };


  const saveGameResults = (user) => {
    if (gameSaved) {
      // console.log('Game already saved, skipping save.');
      return;}
    const gameData = {
      user_id: user_id,
      total_score: scoreRef.current,
      rounds: roundResults
    };
    API.saveGame(gameData)
      .then(response => {
        setGameSaved(true);
        // console.log('Game results saved:', response);
      })
      .catch(error => {
        console.error('Error saving game results:', error);
      });

      
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
            <h2>Round Summary</h2>
            {roundResults.map((result, index) => (
              <div>
                <Image src={result.meme.url} fluid className="meme-image" />
                <p>Correct: {result.isCorrect ? 'Yes' : 'No'}</p>
                {!result.isCorrect && (
                  <div>
                    <h3>Best Captions 1 :{result.caption[0]}</h3>
                    <h3>Best Caption 2: {result.caption[1]}</h3>
                    </div>
                )}
                {result.isCorrect && (
                  <div>
                    <p>Caption: {result.caption}</p>
                    </div>
                )}
              </div>
            ))}
            <Button variant="primary" onClick={handlePlayAgain}>
              Play Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/profile')}>
              Go Home
            </Button>
          </Col>
        </Row>
       
      </Container>
    );
  }


  return (
    <Container className="game-page">
      <Row className="justify-content-center align-items-center">
        <Container className='game-meme'>
        <Col xs={12} md={6} lg={4} className="text-center">
          <Image src={randomImage.url} fluid className="meme-image mb-4" />
          <p>Time remaining: {timer} seconds</p>
        </Col>
        </Container>
        
        <Col xs={12} md={6} lg={4}>
          <Container className='game-caption'>
          {imageCaptions.map((caption) => (
            <Button
              key={caption.captionId}
              variant={selectedCaption === caption.captionId ? 'primary' : 'outline-primary'}
              className="caption-button mb-2 w-100"
              onClick={() => handleCaptionClick(randomImage, caption.captionId)}
              disabled={!!selectedCaption}
            >
              {caption.text}
            </Button>
          ))}

          </Container>
          {score > 0 && (
            <div className="mt-4 text-center">
              <p>Your score: {score}</p>
              <Button variant="primary" onClick={handleNextRound} className="me-2">
                Next Round
              </Button>
              <Button variant="secondary" onClick={() => navigate('/profile')}>
                Go Home
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};


export default GamePage;
