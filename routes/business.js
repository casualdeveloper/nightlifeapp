const router = require("express").Router();
const querystring = require("querystring");
const businessQueries = require("../businessQueries.js");

router.post("/api/business/increment",function(req,res){
     let id = querystring.escape(req.body.id);//precent-encode business id
     //will increase counter variable by 1
     //if business does NOT exists in database new document of it will be automatically created
     businessQueries.incrementBusiness(id,(err,json)=>{
         if(err){
             return res.status(200).json({error:"Failed to increment"});
         }
         return res.status(200).json(json);
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