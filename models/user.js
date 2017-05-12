const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    profileName: String,
    uid: String,
    goingTo: [{
        _id: {
            ref: "business",
            type: mongoose.Schema.Types.ObjectId
        }
    }]
});


const user = mongoose.model("user", userSchema);

module.exports = user;