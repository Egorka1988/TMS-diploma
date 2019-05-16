
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
        }
        ]
        
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: "./src/index.html"
        })
    ],
    watch: true
    };