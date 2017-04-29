const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require("./routes/index.js"));

app.listen(8080, "127.0.0.1", function (err) {
    if (err) {
        console.log("server failed to start");
    } else {
        console.log("server started successfully");
    }
});