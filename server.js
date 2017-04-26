const express = require("express");
const app = express();


app.get("/", function(req, res) {
    res.send("<h1>HELLO! :))</h1>");
});


app.listen(8080, "127.0.0.1", function(err) {
    if (err) {
        console.log("server failed to start");
    } else {
        console.log("server started successfully");
    }
});