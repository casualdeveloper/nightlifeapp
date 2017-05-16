const router = require("express").Router();
const passport = require("passport");

router.get("/auth/twitter", passport.authenticate("twitter"));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get("/auth/twitter/callback",
    passport.authenticate("twitter", { successRedirect: "/successLogin", failureRedirect: "/failure" }));


//these routes are here to prevent react router grabbing them before passport is allowed to butt in ant process response from twitter
router.get("/failure",function(req,res,next){
    res.redirect("/");
});

router.get("/successLogin",function(req,res,next){
    res.redirect("/");
});

module.exports = router;