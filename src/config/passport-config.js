// const passport = require("passport");
// const User = require("../models/user");
// const TwitterStrategy = require('passport-twitter-oauth2');
// require('dotenv').config();

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

// const strategy =
//   new TwitterStrategy(
//     {
//       clientID: process.env.TWITTER_CLIENT_ID, 
//       clientSecret: process.env.TWITTER_CLIENT_SECRET,
//       clientType: 'confidential',
//       callbackURL: "http://localhost:3001/auth/twitter/callback"
//       //userProfileURL: "https://api.twitter.com/2/account/verify_credentials.json", // Adjusted userProfileURL
//     },
//     async (token, tokenSecret, profile, done) => {
//       console.log('OAuth Token:', token);
//       console.log('OAuth Token Secret:', tokenSecret);
//       console.log('Twitter API Response:', {
//         id: profile.id,
//         displayName: profile.displayName,
//         // Add other relevant fields...
//       });

//       try {
//         // Check if the user already exists in the database
//         const userExist = await User.findOne({
//           twitterId: profile.id,
//         });

//         // If the user does not exist, create a new user in the database
//         if (!userExist) {
//           const user = await User.create({
//             twitterId: profile.id,
//             displayName: profile.displayName,
//             profileImageUrl: profile.profileImageUrl
//           });
//           return done(null, user);
//         }

//         // If the user already exists, return the existing user
//         done(null, userExist);
//       } catch (error) {
//         console.error("Error in authentication callback:", error);
//         done(error);
//       }
//     }
//   );

// module.exports = strategy;
