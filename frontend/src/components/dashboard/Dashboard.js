import React, { Component, useEffect, useState, useReducer } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getGames } from "../../store/actions/gamesActions";
import AvailableGames from "../games/AvailableGamesList";
import MyGames from "../games/MyGames";
import { Link } from "react-router-dom";
import { joinGame } from "../../store/actions/gamesActions";

function reducer() {

}


function Dashboar() {
  // const [state1, setState] = useState();
  // const [state, dispatch] = useReducer(reducer, {})

  const deleteHandler = id => {
    console.log("player deleted pending game");
  };
  const giveUpHandler = id => {
    console.log("player gave up");
  };
  const joinHandler = game => {
    joinGame(game);
  };
  useEffect(() => {
    setState(getGames());
  }, []);

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
          {availableGames && (
            <AvailableGames
              availableGames={state.availableGames ? state.availableGames : null}
              joinHandler={joinHandler}
              joinErr={joinErr}
            />
          )}
        </div>
        <div className="col s12 m5 offset-m1">
          <p />
          <button className="btn-large  red">
            <span>Arhive games</span>
          </button>
          {myGames && (
            <MyGames
              currUser={currUser}
              myGames={myGames}
              resumeHandler={resumeHandler}
              deleteHandler={deleteHandler}
              giveUpHandler={giveUpHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
}

class Dashboard extends Component {
  state = {
    shouldRedirectToJoin: false,
    err: null
  };
  componentDidMount() {
    this.props.getGames();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.gameId &&
      this.props.gameId !== prevProps.gameId &&
      this.setState({ shouldRedirectToJoin: true });
  }

  joinHandler = game => {
    this.props.joinGame(game);
  };
  resumeHandler = gameId => {
    console.log("resume", gameId);
    this.setState({ resumeActiveGameId: gameId });
  };

  render() {
    const {
      authToken,
      availableGames,
      myGames,
      joinErr,
      gameId,
      currUser
    } = this.props;
    if (!authToken) {
      return <Redirect to="/auth" />;
    }
    if (this.state.shouldRedirectToJoin) {
      return <Redirect to={"/join/" + gameId} />;
    }
    if (this.state.shouldResumeActiveGame) {
      const id = this.state.resumeActiveGameId;
      return <Redirect to={"/active-game/" + id} />;
    }
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
            {availableGames && (
              <AvailableGames
                availableGames={availableGames.length ? availableGames : null}
                joinHandler={this.joinHandler}
                joinErr={joinErr}
              />
            )}
          </div>
          <div className="col s12 m5 offset-m1">
            <p />
            <button className="btn-large  red">
              <span>Arhive games</span>
            </button>
            {myGames && (
              <MyGames
                currUser={currUser}
                myGames={myGames}
                resumeHandler={this.resumeHandler}
                deleteHandler={this.deleteHandler}
                giveUpHandler={this.giveUpHandler}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currUser: state.auth.currentUser,
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
