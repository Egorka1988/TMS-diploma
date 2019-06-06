
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack")

module.exports = {
    entry: ['babel-polyfill', "./src/index.js"],
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index-bundle.js",
        publicPath: "/",
    },

    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /nod_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            test: /\.css$/,
            loader: ["style-loader",  "css-loader"]
        }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: "./src/index.html"
        }), 
        new webpack.DefinePlugin({
            'SERVICE_URL': JSON.stringify('http://192.168.32.107:8000')
          }), 
    ],
    watch: true
    };