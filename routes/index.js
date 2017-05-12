const router = require("express").Router();
const request = require("request-promise-native");
const querystring = require("querystring");

const searchOptions = function(str) {  
    return {   
        url: `https://api.yelp.com/v3/businesses/search?location=${str}&categories=nightlife`,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Accept-Charset": "utf-8",
            "Authorization": require("../config.json").access_token
        }
    }
};

const businessOptions = function(id){
    return [
        {
            url: `https://api.yelp.com/v3/businesses/${id}`,
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Accept-Charset": "utf-8",
                "Authorization": require("../config.json").access_token
            }
        },
        {
            url: `https://api.yelp.com/v3/businesses/${id}/reviews`,
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Accept-Charset": "utf-8",
                "Authorization": require("../config.json").access_token
            }
        }
    ]
        
    
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

router.post("/api/search",function(req,res){
    let str = querystring.escape(req.body.str);//precent-encode search string
    request(searchOptions(str))
        .then(json=>{
            res.status(200).json(parseJSON(json));
        }).catch(err=>{
            res.status(200).json({error:"Failed to retrieve data from yelp Api, please try again later."});
        });
});


router.get("/api/business/:id",function(req,res){
    let id = querystring.escape(req.params.id);//precent-encode business id
    const promises = businessOptions(id).map(options => request(options));
    Promise.all(promises)
        .then(data=>{
            let json1 = parseJSON(data[0]);
            let json2 = parseJSON(data[1]);
            if(!json1.error && !json2.error){
                json1.reviews = json2.reviews;
            }else{
                json1 = {error:"Failed to retrieve valid data from yelp API, please check if link is correct or try again later."};
            }
            res.status(200).json(json1);
        }).catch(err=>{
            res.status(200).json({error:"Failed to retrieve data from yelp Api, please try again later."});
        });
});

router.get("*", function (req, res) {
    res.render('index.ejs');
});






module.exports = router;