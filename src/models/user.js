const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    twitterId: {
        type: String,
    },
    displayName: {
        type: String
    },
    token: {
        type: String
    },
    tokenSecret: {
        type: String,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;