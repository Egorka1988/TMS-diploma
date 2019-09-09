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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";


function App(props) {
  return (
    
      <MuiThemeProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route path="/auth" component={Auth} />
            <ProtectedRoute exact path="/" component={Dashboard} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/create" component={NewGame} />
            <ProtectedRoute path={"/join/:gameId"} component={JoinGame} />
            <ProtectedRoute
              path={"/active-games/:gameId"}
              component={ActiveGame}
            />
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    gameId: state.games.gameId
  };
};

export default connect(mapStateToProps)(App);
