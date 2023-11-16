const express = require("express");
const session = require("express-session");
const cookieSession = require("cookie-session");
const cors = require("cors");
const passport = require("./src/config/passport-config")
const connectDatabase = require("./src/db/dbconfig");
const cookieParser = require("cookie-parser");  // to parse cookie header

const app = express();

require('dotenv').config();

connectDatabase();


// Use environment variables for sensitive information
const {
  SESSION_SECRET,
} = process.env;

app.use(
  cookieSession({
    name: "session",
    keys: [SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 100
  })
);

app.use(
  session({ 
    secret: SESSION_SECRET, 
    resave: true, 
    saveUninitialized: true,
    // store: new MongoStore 
  })
);

//ini passport
app.use(passport.initialize());

// deserialize cookie from the browser
app.use(passport.session());


app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3001/", // Replace with the actual origin of your frontend application
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const user = require("./src/controllers/users")


app.use("/auth", user)



// app.get("/protected", isAuthenticated, (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ message: "User is authenticated!", user: req.user });
//   } else {
//     res.status(401).json({ message: "User is not authenticated!" });
//   }
// });

// Middleware to ensure authentication
// const isAuthenticated = (req, res, next) => {
//   if (req.user) {
//     res.status(401).json({
//       authenticated: false,
//       message: "User has not been authenticated"
//     });
//   }else{
//     next();
//   }
// };

// const isAuthenticated = (req, res, next) => {
//   if (req.user) {
//     res.status(401).json({
//       authenticated: false,
//       message: "User has not been authenticated"
//     });
//   }else{
//     next();
//   }
// };

// app.get("/protected", isAuthenticated, (req, res) => {
//   if (req.user) {
//     res.json({
//        message: "User is authenticated!", 
//        user: req.user, 
//        cookies:req.cookies
//       });
//   } else {
//     res.status(401).json({ message: "User is not authenticated!" });
//   }
// });


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});