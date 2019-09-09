require("@babel/register");
require("babel-polyfill");

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./store/reducers/rootReducer";
// import { initialLoad } from "./store/actions/gamesActions";
import { localStoreTokenManager, getTokenCsrf } from "./utils";
import { ApolloProvider } from "react-apollo";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { ApolloLink, concat } from "apollo-link";
import introspectionResult from "./introspectionResult.json";

const initialState = {
  auth: { authToken: null }
};

export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk)
);

store.subscribe(localStoreTokenManager(store));

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult
});

const cache = new InMemoryCache({
  fragmentMatcher
});

const link = new HttpLink({
  uri: SERVICE_URL + "/graphql/",
  credentials: "include",
  headers: {
    "X-Csrftoken": getTokenCsrf()
  },
  fetchOptions: {
    mode: "cors"
  }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = store.getState().auth.authToken || null;
  token &&
    operation.setContext({
      headers: {
        Authorization: "Bearer " + token
      }
    });

  return forward(operation);
});

export const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, link)
});

console.log("apprender");
ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
