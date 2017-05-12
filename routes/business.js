const router = require("express").Router();
const querystring = require("querystring");
const businessQueries = require("../businessQueries.js");

router.post("/api/business/increment",function(req,res){
     let id = querystring.escape(req.body.id);//precent-encode business id
     businessQueries.incrementBusiness(id,(err,json)=>{
         if(err){
             return res.status(200).json({error:"Failed to increment"});
         }
         return res.status(200).json(json);
     });
});

module.exports = router;