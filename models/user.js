const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    profileName: String,
    uid: String,
    goingTo: [{
        id: String
    }]
});


const user = mongoose.model("user", userSchema);

module.exports = user;