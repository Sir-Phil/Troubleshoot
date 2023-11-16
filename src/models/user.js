const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    twitterId: {
        type: String,
    },
    displayName: {
        type: String
    },
    profileImageUrl:{
        type: String,
    } 
});

const User = mongoose.model("User", userSchema);

module.exports = User;