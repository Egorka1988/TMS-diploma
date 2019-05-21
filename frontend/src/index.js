require("@babel/register");
require("babel-polyfill");


import React from "react";
import ReactDOM from "react-dom";
import App from './App.js'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './store/reducers/rootReducer'
import { initialLoad } from './store/actions/authActions';
import { localStoreTokenManager } from './utils';


const initialState = {
    auth: {'authToken':null}
};

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
);

store.subscribe(localStoreTokenManager(store));
// store.dispatch(initialLoad());


ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById("root"));