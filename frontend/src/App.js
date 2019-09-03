import React, { Component, useEffect, useState } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/layout/Navbar";
import Profile from "./components/auth/Profile";
import Auth from "./components/auth/Auth";
import NewGame from "./components/games/NewGame";
import JoinGame from "./components/games/JoinGame";
import ActiveGame from "./components/games/ActiveGame";
import { connect } from "react-redux";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

const MUTATION_REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
    }
  }
`;

function App(props) {
  const [refreshToken, { newToken, error }] = useMutation(
    MUTATION_REFRESH_TOKEN
  );
  const [redirect, setRedirect] = useState(false);
  const { authToken, exp, origIat } = props;
  useEffect(() => {
    if (!authToken || Date.now() - exp >= 0) {
      console.log("token invalidated. Redirect to Auth... ");
      setRedirect(true);
    }
    // const delta = exp - origIat - 10; //seconds
    // let timerId = setTimeout(
    //   refreshToken({
    //     variables: { token: authToken }
    //   }),
    //   delta * 1000
    // );
    // return () => { console.log("refreshing timer skipped"); clearTimeout(timerId) };
  }, [authToken]);

  const redirectHandler = comp => {
    if (redirect) {
      authToken && setRedirect(false);
      return Auth;
    } else {
      return comp;
    }
  };
  
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={redirectHandler(Dashboard)} />
        <Route path="/auth" component={Auth} />
        <Route path="/profile" component={Profile} />
        <Route path="/create" component={redirectHandler(NewGame)} />
        <Route path={"/join/:gameId"} component={redirectHandler(JoinGame)} />
        <Route path={"/active-games/:gameId"} component={redirectHandler(ActiveGame)} />
      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = state => {
  return {
    gameId: state.games.gameId,
    authToken: state.auth.authToken,
    exp: state.auth.exp,
    origIat: state.auth.origIat
  };
};

export default connect(mapStateToProps)(App);
