const mongoose = require("mongoose");
const user = require("./models/user.js");


const addBusiness = function(id,businessId,cb){
    return new Promise((resolve,reject)=>{
        user.findByIdAndUpdate(id,{$push:{goingTo:businessId}},function(err,res){
            if(err){
                if(cb){
                    cb(err);
                }
                return reject(err);
            }
            if(cb){
                cb(null,res);
            }
            return resolve(res);
            
        });
    });
    
}

const removeBusiness = function(id,businessId,cb){
    return new Promise((resolve,reject)=>{
        user.findByIdAndUpdate(id,{$pull:{goingTo:businessId}},function(err,res){
            if(err){
                if(cb){
                    cb(err);
                }
                return reject(err);
            }
            if(cb){
                cb(null,res);
            }
            return resolve(res);
            
        });
    });
    
}

const setLastSearched = function(id,str,cb){
    return new Promise((resolve,reject)=>{
        user.findByIdAndUpdate(id,{$set:{lastSearched:str}},function(err,res){
            if(err){
                if(cb){
                    cb(err);
                }
                return reject(err);
            }
            if(cb){
                cb(null,res);
            }
            return resolve(res);
        });
    });
}

module.exports = {addBusiness,removeBusiness,setLastSearched};