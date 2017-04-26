const path = require("path");


module.exports = {
    entry: "./src/client.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "/public")
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: ["react"]
            }

        }]
    }
};