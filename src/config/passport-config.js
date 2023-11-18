const passport = require("passport");
const User = require("../models/user");
const { Strategy } = require('@superfaceai/passport-twitter-oauth2');
// const TwitterStrategy = require('passport-twitter-oauth2');
require('dotenv').config();


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

//Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const strategy =
  new Strategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      clientType: 'confidential',
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Twitter Profile:', profile);
        // Check if the user already exists in the database
        let user = await User.findOneAndUpdate({ twitterId: profile.id });

        if (!user) {
          // If the user doesn't exist, create a new user in the database
          user = new User({
            twitterId: profile.id,
            displayName: profile.displayName,
            username: profile.username,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          await user.save();
        }

        // Log success and pass the user to the callback
        console.log('Authentication succeeded!', { accessToken, refreshToken });
        return done(null, user);
      } catch (error) {
        console.error('Error during authentication:', error);
        return done(error);
      }
    }
  );

module.exports = strategy;
