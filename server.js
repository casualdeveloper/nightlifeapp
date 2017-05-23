const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config.json");
const sessions = require("client-sessions");

mongoose.connect("mongodb://localhost:27017/nightlifeapp");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//session for messages
app.use(sessions({
  cookieName: "messageSession",
  secret: "doesntmatterthisisamessage",
  duration: 60 *1000 ,
}));


require("./authSetup.js")(app);
app.use(require("./routes/index.js"));

app.listen(8080, "127.0.0.1", function (err) {
    if (err) {
        console.log("server failed to start");
    } else {
        console.log("server started successfully");
    }
});