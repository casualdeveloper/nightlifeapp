const mongoose = require("mongoose");
const business = require("./models/business.js");
const querystring = require("querystring");

const parseDataWithCounter = function(arr){
    
}

const searchBusiness = function(id,cb){
    business.findOne({"id":id},"count",(err,foundBusiness)=>{
        if(err){
            return cb(err);
        }
        if(foundBusiness){
            return cb(null,foundBusiness.counter);
        }
        return cb(null,0);
    });
}

const incrementBusiness = function(id,cb){
    business.findOneAndUpdate({"id":id},{ $inc: { "counter" : 1 }},{new:true,upsert:true},(err,foundBusiness)=>{
        if(err){
            return cb({error:"Couldn't update database, please try again later..."});
        }
        return cb(null,{count:foundBusiness.counter});
    });
}

module.exports = {searchBusiness, incrementBusiness};