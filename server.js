require("babel-register")({
    presets: ["react"]
});

const express = require("express");
const app = express();
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Component = require("./src/components/Component.jsx");

app.use(express.static("public"));

app.get("/", function(req, res) {
    var html = ReactDOMServer.renderToString(React.createElement(Component));
    res.send(html);
});


app.listen(8080, "127.0.0.1", function(err) {
    if (err) {
        console.log("server failed to start");
    } else {
        console.log("server started successfully");
    }
});