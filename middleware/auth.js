const isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect("/auth/");
}

const ifNoUserPermissionDenied = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).send("Permission denied");
}

module.exports = {isLoggedIn,ifNoUserPermissionDenied};