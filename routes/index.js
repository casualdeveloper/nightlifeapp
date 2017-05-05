const router = require("express").Router();
const request = require("request");

const searchOptions = {  
    url: "https://api.yelp.com/v3/businesses/search?location=la&categories=nightlife",
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Accept-Charset": "utf-8",
        "Authorization": require("../config.json").access_token
    }
};

const businessOptions = function(id){
    return {
        url: "https://api.yelp.com/v3/businesses/"+id,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Accept-Charset": "utf-8",
            "Authorization": require("../config.json").access_token
        }
    }
}

router.get("*", function (req, res, next) {
    if(req.headers.data_fetch === "true"){
        return next();
    }
    res.render('index.ejs');
});

router.get("/api/search",function(req,res){
    let json;
    request(searchOptions, function(err, res2, body) {  
        json = JSON.parse(body);
        res.status(200).json(json);
    });
    
});

router.get("/api/business/:id",function(req,res){
    let json;
    //pass id from url to option generator
    request(businessOptions(req.params.id),function(err,res2,body){
        json = JSON.parse(body);
        res.status(200).json(json);
    });
});


module.exports = router;