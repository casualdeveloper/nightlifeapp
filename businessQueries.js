const mongoose = require("mongoose");
const business = require("./models/business.js");
const querystring = require("querystring");

const parseDataWithCounter = function(arr, cb){
    return new Promise((resolve,reject) => {

        const promises = arr.map(obj => getBusinessCounter(obj.id));

        Promise.all(promises)
            .then(data => {
                //append counter to business
                arr.map((business,i) => {
                    business.counter = data[i];
                });
                if(cb){
                    cb(null,arr);
                }
                return resolve(arr);
            }).catch(err=>{
                if(cb){
                    cb(err);
                }
                return reject(err);
            });
    });
    
}

const getBusinessCounter = function(id,cb){
    return new Promise((resolve,reject)=>{
        business.findOne({"id":id},"counter",(err,foundBusiness)=>{
            if(err){
                if(cb){
                    cb(err);
                }
                return reject(err);
            }
            if(foundBusiness){
                if(cb){
                    cb(null,foundBusiness.counter);
                }
                return resolve(foundBusiness.counter);
            }
            //if business id is not in the database simply return 0 
            if(cb){
                return cb(null,0);
            }  
            return resolve(0);
            
        });
    });
    
}

const incrementBusiness = function(id,cb){
    business.findOneAndUpdate({"id":id},{ $inc: { "counter" : 1 }},{new:true,upsert:true},(err,foundBusiness)=>{
        if(err){
            return cb({error:"Couldn't update database, please try again later..."});
        }
        return cb(null,{counter:foundBusiness.counter});
    });
}

module.exports = {parseDataWithCounter, getBusinessCounter, incrementBusiness};