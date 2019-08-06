import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getGames } from "../../store/actions/gamesActions";
import AvailableGames from "../games/AvailableGamesList";
import { Link } from "react-router-dom";
import { joinGame } from "../../store/actions/gamesActions";

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

  render() {
    const { authToken, availableGames, joinErr, gameId } = this.props;
    if (!authToken) {
      return <Redirect to="/auth" />;
    }
    if (this.state.shouldRedirectToJoin) {
      return <Redirect to={"/join/" + gameId} />;
    }
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m6">
            {availableGames && (
              <AvailableGames
                availableGames={availableGames.length ? availableGames : null}
                joinHandler={this.joinHandler}
                joinErr={joinErr}
              />
            )}
          </div>
          <div className="col s12 m5 offset-m1">
            <Link to="/create/">
              <div className="btn-floating btn-large waves-effect waves-light red">
                <i className="material-icons">add</i>
              </div>
              <span> Create new game</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.authToken,
    availableGames: state.games.availableGames,
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
