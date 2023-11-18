
const express = require('express');
const passport = require('passport');
const passportStrategy = require("./src/config/passport-config")
//const TwitterStrategy = require('passport-twitter-oauth2').Strategy
const session = require('express-session');
const cors = require("cors");
require('dotenv').config();
const connectDatabase = require("./src/db/dbconfig");


connectDatabase();
const app = express();

app.use(passport.initialize());
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
);

passport.use(passportStrategy);

app.use(
  cors({
    origin: "http://localhost:3001/", // Replace with the actual origin of your frontend application
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//import routes
const user = require("./src/controllers/users")

// twitter user endpoints
app.use("/auth", user)

app.listen(3001, () => {
  console.log(`Listening on ${process.env.BASE_URL}`);
});