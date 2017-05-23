const router = require("express").Router();

router.use(require("./yelpApi.js"));
router.use(require("./business.js"));
router.use(require("./twitterAuth.js"));

router.get("/favicon.ico",function(req,res){
    res.status(401);
});

router.get("*", function (req, res) {

    if(req.messageSession && req.messageSession.message){
        if(req.messageSession.message.shown){
            delete req.messageSession.message;
        }else{
            req.messageSession.message.shown = true;
        }
        
    }
    res.render("index.ejs",{message:req.messageSession.message});
    
});

module.exports = router;