const mongoose = require("mongoose");
const business = require("./models/business.js");
const querystring = require("querystring");

const parseDataWithCounter = function(arr, cb){
    return new Promise((resolve,reject) => {

        //requests to the database retrieveing "counter" data of business
        const promises = arr.map(obj => getBusinessCounter(obj.id));

        Promise.all(promises)
            .then(data => {
                //append counter to business
                arr.map((business,i) => {
                    business.counter = data[i];
                });
                //return new counter-parsed array
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

const getBusinessCounter = function(id,noError,cb){
    id = querystring.escape(id);

    //making noError optional
    if(typeof(noError)==="function"){
        cb=noError;
        noError = false;
    }
    //if noError set to true error will be replace with default value (0);
    return new Promise((resolve,reject)=>{
        business.findOne({"id":id},"counter",(err,foundBusiness)=>{
            if(err){
                if(cb){
                    if(noError){
                        cb(null,0)
                    }else{
                        cb(err);
                    }
                }
                if(noError){
                    return resolve(0);
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

const incrementBusiness = function(id,amount,cb){
    let increaseBy;
    if(typeof(amount) === "function"){
        increaseBy = 1;
        cb = amount;
    }else{
        increaseBy = amount;
    }
    //seraches for business and updates it;
    //if not business found by id, automatically creates new document for it with "counter" value of 1;
    return new Promise((resolve,reject)=>{
        business.findOneAndUpdate({"id":id},{ $inc: { "counter" : increaseBy }},{new:true,upsert:true},(err,foundBusiness)=>{
            if(err){
                if(cb){
                    cb(err);
                }
                return reject(err);
            }
            if(cb){
                cb(null,{counter:foundBusiness.counter});
            }
            return resolve({counter:foundBusiness.counter});
        });
    });
    
}

module.exports = {parseDataWithCounter, getBusinessCounter, incrementBusiness};