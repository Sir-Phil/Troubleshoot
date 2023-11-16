const passport = require("passport");
const User = require("../models/user");
const TwitterStrategy = require("passport-twitter").Strategy;
require('dotenv').config();


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:3001/auth/twitter/callback",
      userProfileURL: "https://api.twitter.com/2/tw",
    },
    async (token, tokenSecret, profile, done) => {
      console.log('OAuth Token:', token);
      console.log('OAuth Token Secret:', tokenSecret);
      console.log('Twitter API Response:', profile);
      // Check if the user already exists in the database
      const userExist = await User.findOne({
        twitterId: profile.id,
      });

      // If the user does not exist, create a new user in the database
      if (!userExist) {
        const user = await new User({
          twitterId: profile.id,
          displayName: profile.displayName,
          token: token,
          tokenSecret: tokenSecret,
        }).save();

        return done(null, user);
      }

      // If the user already exists, return the existing user
      done(null, userExist);
    }
  )
);

module.exports = passport;


