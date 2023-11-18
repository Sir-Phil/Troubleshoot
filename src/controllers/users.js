const router = require("express").Router();
const passport = require("passport")
require('dotenv').config();

router.get(
    '/twitter',
    passport.authenticate('twitter', {
      scope: ['tweet.read', 'users.read', 'offline.access'],
    })
  );
  
  router.get(
    '/twitter/callback',
    passport.authenticate('twitter'),
    function (req, res) {
      const userData = JSON.stringify(req.user, undefined, 2);
      res.end(
        `<h1>Authentication succeeded</h1> User data: <pre>${userData}</pre>`
      );
    }
  );
  
module.exports = router;