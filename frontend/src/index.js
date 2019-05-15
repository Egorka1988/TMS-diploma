require("@babel/register");
require("babel-polyfill");

import React from "react";
import ReactDOM from "react-dom";
import App from './App.js'

ReactDOM.render(<App />, document.getElementById("root"));