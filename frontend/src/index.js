require("@babel/register");
require("babel-polyfill");

import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import App from "./App.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./store/reducers/rootReducer";
// import { initialLoad } from "./store/actions/gamesActions";
import { localStoreTokenManager, getTokenCsrf } from "./utils";


const cache = new InMemoryCache();
const link = new HttpLink({
  uri: SERVICE_URL + "/graphql/",
  credentials: "include",
  headers: {
    "X-Csrftoken": getTokenCsrf(),
    "Authorization": "Bearer " + localStorage.getItem("authToken") 
  },
  fetchOptions: {
    mode: "cors"
  }
});

const client = new ApolloClient({
  cache,
  link
});

const initialState = {
  auth: { authToken: null }
};
export const MyContext = React.createContext(1);
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk)
);

store.subscribe(localStoreTokenManager(store));
// store.dispatch(initialLoad());

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
