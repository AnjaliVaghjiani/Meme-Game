// imports
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import GameDao  from "./Dao/game.mjs"
import crypto from 'crypto';
import UserLogin from "./Dao/login.mjs";
import passport from "./Dao/auth.mjs";
import session from 'express-session';


const port = 3001;


const gameDAO = new GameDao();
const userDAO = new UserLogin();
const app = express();
app.use(morgan('dev'));

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


const errorFormatter = ({msg}) => {
  return msg;
};

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info){
    // console.log("Authentication info:", info);  // Debugging line
    // console.log("Authenticated user:", user); 
    if (err) {
      return next(err);}
    if (!user) {
      // console.log("or here")
      return res.status(400).json({ message: "info.message" });}

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ user:user, message: 'Login successful', success: true });
    });
  })(req, res, next);
});




app.get('/api/random-image', (req, res) => {
  gameDAO.getRandomImage()
    .then(image => {
      res.json(image);
    })
    .catch(error => {
      console.error('Error fetching random image:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


app.get('/api/image-captions/:imageId', (req, res) => {
  const imageId = req.params.imageId;
  gameDAO.getImageCaptions(imageId)
    .then(captions => {
      res.json(captions);
    })
    .catch(error => {
      console.error(`Error fetching captions for image ${imageId}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/api/validate-caption', async (req, res) => {
  const { memeId, captionId } = req.body;
  const isCorrect = await gameDAO.validateCaption(memeId, captionId)
    .then(result => result)
    .catch(error => {
      console.error('Error validating caption:', error);
      if (error.message === 'Caption not found') {
        return res.status(404).json({ error: 'Caption not found' });
      }
      return null;
    });

  if (isCorrect === null) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json({ isCorrect });
});

app.post('/api/best-captions', async (req, res) => {
  const { memeId } = req.body;

  const bestCaptions = await gameDAO.getBestCaptions(memeId)
    .then(result => result)
    .catch(error => {
      console.error('Error fetching best captions:', error);
      if (error.message === 'Meme not found') {
        return res.status(404).json({ error: 'Meme not found' });
      }
      return null;
    });

  if (bestCaptions === null) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json({ bestCaptions });
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Unauthenticated'});
}

app.post('/api/save-game', (req, res) => {
  const { total_score, rounds } = req.body;
  const user_id = req.body.user_id;
  // console.log("what is the is ", req.body);
  gameDAO.saveGame(user_id, total_score, rounds)
    .then(message => res.json({ message }))
    .catch(error => res.status(500).json({ error }));
});

app.get('/api/game-history/:userId', (req, res) => {
  // console.log("what is userid in save game history ", req.params.userId);
  const userId = req.params.userId;

  gameDAO.getGameHistory(userId)
    .then(games => res.json(games))
    .catch(error => res.status(500).json({ error }));
});



app.post('/api/save-round', (req, res) => {
  const roundData = req.body;
  gameDAO.saveRound(roundData)
    .then(() => {
      res.status(200).json({ message: 'Round data saved successfully' });
    })
    .catch(error => {
      console.error('Error saving round data:', error);
      res.status(500).json({ error: 'Failed to save round data' });
    });
});

app.get('/api/start-game', (req, res) => {
  const { userId } = req.body;
  gameDAO.startNewGame(userId)
    .then(gameId => {
      res.status(200).json({ gameId });
    })
    .catch(error => {
      console.error('Error starting new game:', error);
      res.status(500).json({ error: 'Failed to start new game' });
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/api/user/:userId/total-score', async (req, res) => {
  const { userId } = req.params;

  try {
    const totalUserScore = await gameDAO.getUserTotalScore(userId);
    res.json({ totalUserScore });
  } catch (err) {
    console.error('Error fetching total score:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ message: 'Logout failed' });
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logout successful' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});