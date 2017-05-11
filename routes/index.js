const router = require("express").Router();
const request = require("request-promise-native");
const querystring = require("querystring");

const searchOptions = {  
    uri: "https://api.yelp.com/v3/businesses/search?location=la&categories=nightlife",
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

const parseJSON = function(str){
    let json;
    try{
        json = JSON.parse(str);
    } catch (e){
        json = {error: "Failed to retrieve valid data from yelp API, please check if link is correct or try again later."}
    }
    return json;
}

router.get("/api/search",function(req,res){
    request(searchOptions)
        .then(json=>{
            res.status(200).json(parseJSON(json));
        }).catch(err=>{
            res.status(200).json({error:err.message});
        });
});


router.get("/api/business/:id",function(req,res){
    let id = querystring.escape(req.params.id);//precent-encode business id
    request(businessOptions(id))
        .then(json=>{
            res.status(200).json(parseJSON(json));
        }).catch(err=>{
            res.status(200).json({error:"Failed to retrieve data from yelp Api, please try again later."});
        })
});

router.get("*", function (req, res) {
    res.render('index.ejs');
});






module.exports = router;