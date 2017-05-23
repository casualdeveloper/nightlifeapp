const user = require("./models/user.js");

const passport = require("passport");
const passportTwitter = require("passport-twitter").Strategy;
const config = require("./config.json");

const sessions = require("client-sessions");


module.exports = function(app){
    
    //Storing sessions on client
    app.use(sessions({
        cookieName: "session",
        secret: config.SESSION_SECRET,
        duration: 7 * 24 * 60 * 60 * 1000,
        activeDuration: 3 * 24 * 60 * 60 * 1000
    }));

    app.use(passport.initialize());
    app.use(passport.session());


    passport.use(new passportTwitter({
            consumerKey: config.TWITTER_CONSUMER_KEY,
            consumerSecret: config.TWITTER_CONSUMER_SECRET,
            callbackURL: config.TWITTER_CALLBACK_URL
        },
        function(token, tokenSecret, profile, done) {
            user.findOne({uid:profile.id},
                function(err, foundUser) {
                    if (err)
                        return done(err);

                    if (!foundUser) {
                        foundUser = new user({
                            profileName: profile.displayName,
                            uid: profile.id
                        });
                        foundUser.save(function(err) {
                            if (err) return done(err);
                            return done(null, foundUser);
                        });
                    } else {
                        return done(null, foundUser);
                    }
                });
        }
    ));

    passport.serializeUser(function(user,done){
        done(null,user._id);
    });
    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
            done(err, user);
        });
    });

    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
}
