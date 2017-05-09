const router = require("express").Router();
const request = require("request");
const querystring = require("querystring");

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

router.get("/api/search",function(req,res){
    let json;
    request(searchOptions, function(err, res2, body) {
        if(err){
            return console.log(err.message);
        }  
        try {
            json = JSON.parse(body);
        } catch (e) {
            return res.status(200).json({
                error: "Failed to retrieve valid data from yelp API, please check if link is correct or try again later."
            });
        }
        res.status(200).json(json);
    });
    
});


router.get("/api/business/:id",function(req,res){
    let json;
    let id = querystring.escape(req.params.id);//precent-encode business id
    console.log(id);
    //pass id from url to option generator
    request(businessOptions(id),function(err,res2,body){
        if(err){
            return console.log(err.message);
        }
        try {
            json = JSON.parse(body);
        } catch (e) {
            return res.status(200).json({
                error: "Failed to retrieve valid data from yelp API, please check if link is correct or try again later."
            });
        }
        res.status(200).json(json);
        
    });
});

router.get("*", function (req, res) {
    res.render('index.ejs');
});






module.exports = router;