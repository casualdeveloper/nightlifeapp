const router = require("express").Router();
const passport = require("passport");
const userQueries = require("../userQueries.js");

router.get("/auth/:search",function(req,res,next){
    //put search into session
    req.session.searched = req.params.search;
    next();
},passport.authenticate("twitter"));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get("/auth/twitter/callback",
    passport.authenticate("twitter", { successRedirect: "/successLogin", failureRedirect: "/failure" }));


//these routes are here to prevent react router grabbing them before passport is allowed to butt in and process response from twitter
router.get("/failure",function(req,res,next){
    req.messageSession.message = {type:"error",message:"Failed to authenticate, please try again later."};
    res.redirect("/");
});

router.get("/successLogin",function(req,res,next){

    //retrieve last searched place from session and update user
    //delete that part of session
    let searched = req.session.searched;
    let searchedTrimmed = searched.trim();
    if(searchedTrimmed !== "" && searchedTrimmed !== "null"){
        userQueries.setLastSearched(req.user._id,req.session.searched);
        delete req.session.searched;
    };
    req.messageSession.message = {type:"success",message:"Authentication successfull."};
    res.redirect("/");
});

module.exports = router;