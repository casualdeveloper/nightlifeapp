const router = require("express").Router();
const querystring = require("querystring");
const businessQueries = require("../businessQueries.js");
const userQueries = require("../userQueries.js");

router.post("/api/business/increment",function(req,res){
     let id = querystring.escape(req.body.id);//precent-encode business id
     
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

router.post("/api/business/decrement",function(req,res){
     let id = querystring.escape(req.body.id);//precent-encode business id
     
     userQueries.removeBusiness(req.user._id,id)
        .then(data=>{
            //will decrease counter variable by 1
            //if business does NOT exists in database new document of it will be automatically created
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



router.get("/api/business/counter/:id",function(req,res){
    let id = querystring.escape(req.params.id);//precent-encode business id
    
    businessQueries.getBusinessCounter(id,true)
        .then(data=>{
            return res.status(200).json({counter:data});
        });

});

module.exports = router;