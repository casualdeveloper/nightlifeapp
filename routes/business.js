const router = require("express").Router();
const querystring = require("querystring");
const businessQueries = require("../businessQueries.js");
const userQueries = require("../userQueries.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/api/business/increment",authMiddleware.ifNoUserPermissionDenied,function(req,res){

     let id = querystring.escape(req.body.id);//precent-encode business id
     
     userQueries.checkForBusinessInUser(req.user._id,id,function(err,exists){
        //if error occured while searching for business id 
        //or returned variable is true (in case business was already in users goingTo array)
        //simply return error
        if(err || exists){
            return res.status(401).send("Action failed, please try again later...");
        }
        userQueries.addBusiness(req.user._id,id)
        .then(data=>{
            //will increase counter variable by 1
            //if business does NOT exists in database new document of it will be automatically created
            businessQueries.incrementBusiness(id,(err,json)=>{
                if(err){
                    return res.status(401).send("Action failed, please try again later...");
                }
                return res.status(200).json(json);
            });
        }).catch(err=>{
            return res.status(401).send("Action failed, please try again later...");
        });
    });    
});

router.post("/api/business/decrement",authMiddleware.ifNoUserPermissionDenied,function(req,res){

    let id = querystring.escape(req.body.id);//precent-encode business id

    userQueries.checkForBusinessInUser(req.user._id,id,function(err,exists){
        //if error occured while searching for business id 
        //or returned variable is false (in case business was not found in users goingTo array)
        //simply return error
        if(err || !exists){
            return res.status(401).send("Action failed, please try again later...");
        }
        //else
        userQueries.removeBusiness(req.user._id,id)
       .then(data=>{
           //will decrease counter variable by 1
           businessQueries.incrementBusiness(id,-1,(err,json)=>{
               if(err){
                   return res.status(401).send("Action failed, please try again later...");
               }
               return res.status(200).json(json);
           });
       }).catch(err=>{
           return res.status(401).send("Action failed, please try again later...");
       });
    });
    
       
});



router.get("/api/business/counter/:id",function(req,res){
    let id = querystring.escape(req.params.id);//precent-encode business id
    businessQueries.getBusinessCounter(id,true)
        .then(data=>{
            return res.status(200).json({counter:data});
        });

});

module.exports = router;