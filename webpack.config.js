const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

const PATHS = {
    app:path.join(__dirname,"src/client.js"),
    style:path.join(__dirname,"src/styles/style.scss")
}

const autoprefix = function() {
    return {
        loader: "postcss-loader",
        options: {
            plugins: () => ([
                require("autoprefixer"),
            ]),
        },
    };
};

module.exports = {
    entry: {
        app:PATHS.app,
        style:PATHS.style
    },
    devtool:"cheap-source-map",
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "/public")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: PATHS.style,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", autoprefix()],
                    fallback: "style-loader",
                }),
            },
            {
                test: /\.scss$/,
                include: PATHS.style,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", autoprefix(), "sass-loader"],
                    fallback: "style-loader",
                }),
            },
            {
                test: /(\.js|.jsx)$/,
                loader: "babel-loader",
                options: {
                    presets: ["react","es2015"]
            }
        }]
    },
    plugins:[
        new ExtractTextPlugin({
            filename: (process.env.NODE_ENV === "production") ? "css/[name].[contenthash].css" : "[name].css",
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "bundle",

            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf("node_modules") >= 0 &&
                resource.match(/\.js$/)
            ),
        })
    ]
};