const express = require("express");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const connectDatabase = require("./src/db/dbconfig");
const User = require("./src/models/user");

const app = express();

require('dotenv').config();

connectDatabase();


// Use environment variables for sensitive information
const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  SESSION_SECRET,
} = process.env;


app.use(
  session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true })
);

app.use(
  cors({
    origin: "http://localhost:5174", // Replace with the actual origin of your frontend application
    credentials: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());



passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:3001/auth/twitter/callback",
      userProfileURL:
        "https://api.twitter.com/2/account/verify_credentials.json", // Add this line
    },
    async (token, tokenSecret, profile, done) => {
      try {
        if (profile) {
// Check if the user already exists in the database
          const userExist = await User.findOne({
            twitterId: profile.id
          });

          if(userExist){
            return done(null, userExist)
          }
// If the user does not exist, create a new user in the database

          const user = new User({
            twitterId: profile.id,
            displayName: profile.displayName,
            token: token,
            tokenSecret: tokenSecret
          });

          await user.save();
          return done(null, user);
        } else {
          console.error("Failed to fetch user profile.");
          return done(null, false, {
            message: "Failed to fetch user profile.",
          });
        }
      } catch (error) {
        console.error("Error in authentication callback:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
  
});

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/account', isAuthenticated, (req, res) => {
  res.send('Welcome, ' + req.user.displayName);
});

app.get('/login', (req, res) => {
  res.send('Login Page <a href="/auth/twitter">Login with Twitter</a>');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "http://localhost:3001/",
    failureFlash: true,
    session: true,
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "User is authenticated!", user: req.user });
  } else {
    res.status(401).json({ message: "User is not authenticated!" });
  }
});

// Middleware to ensure authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});