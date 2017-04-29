const path = require("path");


module.exports = {
    entry: "./src/client.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "/public")
    },
    module: {
        rules: [{
            test: /\.js$||.jsx$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: ["react","es2015"]
            }

        }]
    }
};