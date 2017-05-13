const router = require("express").Router();
const request = require("request-promise-native");
const querystring = require("querystring");
const businessQueries = require("../businessQueries.js");

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

//simple error handling when parsing json
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
            let resJSON = parseJSON(json);
            if(!resJSON.error){
                //parseDataWithCounter will go throught array of businesses and will try to match ids with ones in database,
                //if business id is in db return current amount of people that are going in counter variable
                //if business id is NOT in db it will simply set counter variable to 0
                businessQueries.parseDataWithCounter(resJSON.businesses,(err,data)=>{
                    if(err){
                        //if error occurs simply return original response from yelp api
                        //on client side we simply check if counter variable exists if it does we simply use default value (0); 
                        return res.status(200).json(resJSON);
                    }
                    //if data was successfully parsed set it to the current business array and send back response now with new "counter-parsed" business array.
                    resJSON.businesses=data;
                    return res.status(200).json(resJSON);
                });
            }else{
                return res.status(200).json(resJSON);
            }
        }).catch(err=>{
            console.log(err);
            res.status(200).json({error:"Failed to retrieve data from yelp Api, please try again later."});
        });
});


router.get("/api/business/:id",function(req,res){
    let id = querystring.escape(req.params.id);//precent-encode business id
    //asyn requests to (originally) 2 links 

    //noError - true, wont return any errors in case of one will return default value of 0
    //this way even if we can NOT retrieve data from our database we will still render business.
    let noError = true;
    const businessCounterPromise = businessQueries.getBusinessCounter(id,noError); 
    const promises = businessOptions(id).map(options => request(options));
    promises.push(businessCounterPromise);
    Promise.all(promises)
        .then(data=>{

            //once data received merge it
            //we will be returning json1 so append reviews to it

            let json1 = parseJSON(data[0]);
            let json2 = parseJSON(data[1]);

            if(!json1.error && !json2.error){
                json1.reviews = json2.reviews;
            }else{
                json1 = {error:"Failed to retrieve valid data from yelp API, please check if link is correct or try again later."};
            }
            //set counter
            json1.counter = data[2];
            
            res.status(200).json(json1);
        }).catch(err=>{
            res.status(200).json({error:"Failed to retrieve data from yelp Api, please try again later."});
        });
});

module.exports = router;