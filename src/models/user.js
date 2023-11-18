const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        twitterId: {
            type: String
        } ,
        displayName:{
            type: String
        } ,
        username:{
            type: String
        } ,
        accessToken:{
            type: String
        } ,
        refreshToken:{
            type: String
        } ,
      });
      

const User = mongoose.model("User", userSchema);

module.exports = User;