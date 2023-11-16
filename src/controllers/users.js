const router = require("express").Router();
const passport = require("passport")
require('dotenv').config();

// app.get('/', (req, res) => {
//     res.send('Home Page');
//   });
  
//   app.get('/account', isAuthenticated, (req, res) => {
//     res.send('Welcome, ' + req.user.displayName);
//   });
  
//   app.get('/login', (req, res) => {
//     res.send('Login Page <a href="/auth/twitter">Login with Twitter</a>');
//   });

router.get("login/success",(req, res) => {
    if(req.user){
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

router.get("/login/failed",(req, res) => {
    res.status(401).json({
        success: false,
        message: "User failed to authenticate."
    });
});
  

router.get("/logout",(req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_HOME_PAGE_UR);
});

router.get("/twitter", passport.authenticate("twitter"));
  
router.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: process.env.CLIENT_HOME_PAGE_UR,
      failureRedirect: "/auth/login/failed",
      failureFlash: true,
      session: true,
    })
  );
  

  module.exports = router;