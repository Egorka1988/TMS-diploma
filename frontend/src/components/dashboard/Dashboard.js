import React, { Component, useEffect, useState, useReducer } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { initialLoad, getGames } from "../../store/actions/gamesActions";
import AvailableGames from "../games/AvailableGamesList";
import MyGames from "../games/MyGames";
import { Link } from "react-router-dom";
import { joinGame } from "../../store/actions/gamesActions";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";

const QUERY_GET_GAMES = gql`
  {
    avGames {
      id
      name
      size
      creator {
        username
      }
    }
    myGames {
      id
      name
      creator {
        username
      }
      size
      joiner {
        username
      }
      turn {
        username
      }
    }
  }
`;

function Dashboard(props) {
  const { data, loading, error } = useQuery(QUERY_GET_GAMES);
  const [avGames, setAvGames] = useState(null);
  const [myGames, setMyGames] = useState(null);

  const deleteHandler = id => {
    console.log("player deleted pending game");
  };
  const giveUpHandler = id => {
    console.log("player gave up");
  };
  const joinHandler = game => {
    joinGame(game);
  };
  const resumeHandler = game => {
    resumeGame(game);
  };
  useEffect(() => {
    console.log("dash_data", data);
    if (!error && data) {
      setAvGames(data.avGames);
      setMyGames(data.myGames);
    };
  }, [data]);

  return (
    <div className="container">
      <div className="row">
        <div className="col s12 m6">
          <p />
          <Link to="/create/">
            <div className="btn-floating btn-large waves-effect waves-light red">
              <i className="material-icons">add</i>
            </div>
            <span> Create new game</span>
          </Link>
          {loading ? <p>loading...</p> :
            <AvailableGames
              availableGames={avGames && avGames.length ? avGames : null}
              joinHandler={joinHandler}
              joinErr={error && joinErr}
            />
          }
        </div>
        <div className="col s12 m5 offset-m1">
          <p />
          <button className="btn-large  red">
            <span>Arhive games</span>
          </button>
          {loading ? <p>loading...</p> :
            <MyGames
              currUser={props.currUser}
              myGames={myGames && myGames.length ? myGames : null}
              resumeHandler={resumeHandler}
              deleteHandler={deleteHandler}
              giveUpHandler={giveUpHandler}
            />
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    currUser: state.auth.currUser,
    authToken: state.auth.authToken,
    availableGames: state.games.availableGames,
    myGames: state.games.myGames,
    joinErr: state.games.err,
    gameId: state.games.gameId
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getGames: () => dispatch(getGames()),
    joinGame: game => dispatch(joinGame(game))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
