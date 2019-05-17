require("@babel/register");
require("babel-polyfill");


import React from "react";
import ReactDOM from "react-dom";
import App from './App.js'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import authReducer from './store/reducers/authReducer'

const initialState = {
    authToken: localStorage.getItem('authToken') || null
}

const store = createStore(
    authReducer,
    initialState,
    applyMiddleware(thunk)
);

ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById("root"));

export default store;