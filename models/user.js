const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    profileName: String,
    uid: String,
    token: String,
    goingTo: [],
    lastSearched: {
        type: String,
        default: ""
    }
});


const user = mongoose.model("user", userSchema);

module.exports = user;