const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    id: String,
    counter: { type:Number, default:0} 
});


const business = mongoose.model("business", businessSchema);

module.exports = business;