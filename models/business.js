const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    id: String,
    //counter - amount of people that are going to the bar,club,event.. (whatever yelp api returns)
    counter: { type:Number, default:0} 
});


const business = mongoose.model("business", businessSchema);

module.exports = business;