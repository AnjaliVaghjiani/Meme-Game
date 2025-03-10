import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator';
import UserLogin from "../Dao/login.mjs"
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import crypto from 'crypto';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const userDAO = new UserLogin();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));


 


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const authenticated = await userDAO.getIsUserAuthenticated(username, password);
      
      if (authenticated) {
        const user = await userDAO.getUserByUsername(username);
        // console.log("what is authenticate ", user);
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect username and/or password" });
      }
    } catch (error) {
      return done(error);
    }
  }
));



passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  const userQuery = 'SELECT * FROM Users WHERE user_id = ?';
  db.get(userQuery, [id], (err, user) => {
    done(err, user);
  });
});





// app.use(session({
//   secret: "This is a very secret information used to initialize the session!",
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.authenticate('session'));


// /** Defining authentication verification middleware **/



// /*** Utility Functions ***/

// // This function is used to handle validation errors
// const onValidationErrors = (validationResult, res) => {
//     const errors = validationResult.formatWith(errorFormatter);
//     return res.status(422).json({validationErrors: errors.mapped()});
// };

// // Only keep the error message in the response
// const errorFormatter = ({msg}) => {
//     return msg;
// };




export default passport;