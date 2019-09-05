import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { handleJoinGameResponse } from "../../store/actions/gamesActions";
import AvailableGames from "../games/AvailableGamesList";
import MyGames from "../games/MyGames";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";

import { MUTATION_JOIN_GAME } from "../../graphQL/dashboard/mutations";
import "react-toastify/dist/ReactToastify.css";
import { store } from "../..";

function Dashboard(props) {
  const avGamesPerPage = 7;
  const myGamesPerPage = 7;
  const [joinGame, resp] = useMutation(MUTATION_JOIN_GAME);

  const deleteHandler = id => {
    console.log("player deleted pending game");
  };
  const giveUpHandler = id => {
    console.log("player gave up");
  };
  const joinHandler = game => {
    joinGame({
      variables: {
        gameId: game.gameId
      }
    }).then(resp => {
      if (resp.data.joinGame) {
        handleJoinGameResponse(resp.data.joinGame);
      }
    });
  };

  const resumeHandler = game => {
    resumeGame(game);
  };
  useEffect(() => {
    // allow pass to "/" from everywhere and whenever 
    return () => 
      store.dispatch({
        type: "RESTRICT_REDIRECT"
      });
  }, [props.redirectFromDashboard]);

  return (
    <div className="container">
      {props.redirectFromDashboard && <Redirect to={"/join/" + props.gameId} />}
      {!props.authToken && <Redirect to="/auth/" />}
      <div className="row">
        <div className="col s12 m6">
          <p />
          <Link to="/create/">
            <div className="btn-floating btn-large waves-effect waves-light red">
              <i className="material-icons">add</i>
            </div>
            <span> Create new game</span>
          </Link>
          <AvailableGames
            joinHandler={joinHandler}
            avGamesPerPage={avGamesPerPage}
          />
        </div>
        <div className="col s12 m5 offset-m1">
          <p />
          <button className="btn-large  red">
            <span>my arhive games</span>
          </button>
          <MyGames
            resumeHandler={resumeHandler}
            deleteHandler={deleteHandler}
            giveUpHandler={giveUpHandler}
            myGamesPerPage={myGamesPerPage}
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.authToken,
    gameId: state.games.gameId,
    redirectFromDashboard: state.games.redirectFromDashboard
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getGames: () => dispatch(getGames()),
    handleJoinData: data => dispatch(handleJoinGameResponse(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
