// const router = require("express").Router();
// const passport = require("passport")
// require('dotenv').config();


// router.get("login/success",(req, res) => {
//     if(req.user){
//         res.json({
//             success: true,
//             message: "user has successfully authenticated",
//             user: req.user,
//             cookies: req.cookies
//         });
//     }
// });

// router.get("/login/failed",(req, res) => {
//     res.status(401).json({
//         success: false,
//         message: "User failed to authenticate."
//     });
// });
  

// router.get("/logout",(req, res) => {
//     req.logout();
//     res.redirect(process.env.CLIENT_HOME_PAGE_UR);
// });

// router.get("/twitter", passport.authenticate("twitter", {
//     scope: ['tweet.read', 'users.read', 'offline.access'],
// }));
  
// router.get(
//     "/twitter/callback",
//     passport.authenticate("twitter"), (req, res) => {
//         const userData = JSON.stringify(req.user, undefined, 2);
//     res.end(
//       `<h1>Authentication succeeded</h1> User data: <pre>${userData}</pre>`
//     );
//   }
//   );

  

//   module.exports = router;