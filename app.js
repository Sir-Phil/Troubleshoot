// const express = require("express");
// const session = require("express-session");
// const cors = require("cors");
// const passportStrategy = require("./src/config/passport-config")
// const passport = require("passport");
// const connectDatabase = require("./src/db/dbconfig");

// const app = express();

// require('dotenv').config();

// connectDatabase();


// // Use environment variables for sensitive information
// const {
//   SESSION_SECRET,
// } = process.env;


// app.use(
//   session({ 
//     secret: SESSION_SECRET, 
//     resave: true, 
//     saveUninitialized: true,
//     // store: new MongoStore 
//   })
// );

// //ini passport
// app.use(passport.initialize());

// // deserialize cookie from the browser
// app.use(passport.session());
// passport.use(passportStrategy);

// app.use(
//   cors({
//     origin: "http://localhost:3001/", // Replace with the actual origin of your frontend application
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

// const user = require("./src/controllers/users")


// app.use("/auth", user)



// // app.get("/protected", isAuthenticated, (req, res) => {
// //   if (req.isAuthenticated()) {
// //     res.json({ message: "User is authenticated!", user: req.user });
// //   } else {
// //     res.status(401).json({ message: "User is not authenticated!" });
// //   }
// // });

// // Middleware to ensure authentication
// // const isAuthenticated = (req, res, next) => {
// //   if (req.user) {
// //     res.status(401).json({
// //       authenticated: false,
// //       message: "User has not been authenticated"
// //     });
// //   }else{
// //     next();
// //   }
// // };

// // const isAuthenticated = (req, res, next) => {
// //   if (req.user) {
// //     res.status(401).json({
// //       authenticated: false,
// //       message: "User has not been authenticated"
// //     });
// //   }else{
// //     next();
// //   }
// // };

// // app.get("/protected", isAuthenticated, (req, res) => {
// //   if (req.user) {
// //     res.json({
// //        message: "User is authenticated!", 
// //        user: req.user, 
// //        cookies:req.cookies
// //       });
// //   } else {
// //     res.status(401).json({ message: "User is not authenticated!" });
// //   }
// // });


// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const passport = require('passport');
const { Strategy } = require('@superfaceai/passport-twitter-oauth2');
const session = require('express-session');
require('dotenv').config();


passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the Twitter OAuth2 strategy within Passport
passport.use(
  new Strategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      clientType: 'confidential',
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Success!', { accessToken, refreshToken });
      return done(null, profile);
    }
  )
);

const app = express();

app.use(passport.initialize());
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
);

app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    scope: ['tweet.read', 'users.read', 'offline.access'],
  })
);

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter'),
  function (req, res) {
    const userData = JSON.stringify(req.user, undefined, 2);
    res.end(
      `<h1>Authentication succeeded</h1> User data: <pre>${userData}</pre>`
    );
  }
);

app.listen(3001, () => {
  console.log(`Listening on ${process.env.BASE_URL}`);
});