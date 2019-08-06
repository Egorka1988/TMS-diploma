import React, { Component } from "react";
import {
  joinFleet,
  loadActiveGame,
  clickHandle
} from "../../store/actions/gamesActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner } from "../../utils";
import { Map } from "./BattleMap";
import Legend from "./Legend";
import { genBattleMapState } from "./NewGame";

class JoinGame extends Component {
  state = {
    isLoading: false,
    errHandleCompleted: false,
    shouldRedirectToActiveGame: false
  };

  componentWillMount() {
    this.props.loadActiveGame(this.props.match.params.gameId, true);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.isFleetJoined &&
      prevProps.isFleetJoined !== this.props.isFleetJoined &&
      this.setState({ shouldRedirectToActiveGame: true });
  }

  onClick = cell => {
    if (this.state.errHandleCompleted) {
      let resetBattleMap = { ...this.props.battleMap };
      for (let i = 1; i < this.props.size + 1; i++) {
        for (let j = 1; j < this.props.size + 1; j++) {
          resetBattleMap[i][j] = { ...resetBattleMap[i][j], isError: false };
        }
      }
      this.setState({ battleMap: resetBattleMap });
    }
    this.props.clickHandle(cell, this.props.battleMap);
  };

  handleReset = e => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
        size: this.props.size,
        battleMap: genBattleMapState(this.props.size),
        errMsg: null
      },
      () => {
        this.setState({ isLoading: false });
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true, size: this.props.size }, () => {
      this.props
        .joinFleet(this.props, this.props.gameId)
        .finally(() =>
          this.setState({ isLoading: false, errHandleCompleted: false })
        );
    });
  };

  errorHandler = () => {
    const emptyFleet = this.props.emptyFleet;
    const invalidShipType = this.props.invalidShipType;
    const invalidCount = this.props.invalidCount;
    const invalidShipComposition = this.props.invalidShipComposition;
    const forbiddenCells = this.props.forbiddenCells;
    let msg = [];
    let battleMap = this.props.battleMap;

    if (emptyFleet) {
      msg.push(<div key="joinEmptyFleet">{emptyFleet}</div>);
    }
    if (invalidCount) {
      msg.push(
        <div key="invalidJoinCount">
          The ships' count is not correct. Check the schema.{" "}
        </div>
      );
    }
    if (invalidShipType) {
      for (const ship of invalidShipType) {
        msg.push(
          <div key={"joinInvalidShipType" + ship}>
            The ship on
            <font size="+1">
              &nbsp; {ship[0][0]}
              {(ship[0][1] + 9).toString(36)} &nbsp;
            </font>
            is too big
          </div>
        );
        for (const cell of ship) {
          const [x, y] = cell;
          battleMap[x][y] = { ...battleMap[x][y], isError: true };
        }
      }
    }

    if (invalidShipComposition) {
      for (const ship of invalidShipComposition) {
        msg.push(
          <div key={"joinInvalidShipComposition" + ship}>
            The ship on
            <font size="+1">
              &nbsp; {ship[0][0]}
              {(ship[0][1] + 9).toString(36)} &nbsp;
            </font>
            is not properly built. Check the schema
          </div>
        );
        for (const cell of ship) {
          const [x, y] = cell;
          battleMap[x][y] = { ...battleMap[x][y], isError: true };
        }
      }
    }
    if (forbiddenCells) {
      for (const cell of forbiddenCells) {
        const [x, y] = cell;
        battleMap[x][y] = { ...battleMap[x][y], isError: true };
        msg.push(
          <div key={"joinForbiddenCells" + cell}>
            The ship on
            <font size="+1">
              &nbsp; {x}
              {(y + 9).toString(36)} &nbsp;
            </font>
            is too close to other ship
          </div>
        );
      }
    }
    this.setState({
      errHandleCompleted: true,
      battleMap: battleMap,
      errMsg: msg
    });
  };

  render() {
    if (this.state.isLoading) {
      return spinner();
    }
    if (!this.props.auth.authToken) {
      return <Redirect to="/auth" />;
    }
    if (this.state.shouldRedirectToActiveGame) {
      return <Redirect to={"/active-games/" + this.props.gameId} />;
    }
    return (
      <div className="container">
        <div>
          <h5 className="grey-text text-darken-3">
            Name of the game: {this.props.name}
          </h5>
        </div>
        <div className="input-field">
          <h5 className="grey-text text-darken-3">
            Your opponent's name is {this.props.creator}
          </h5>
        </div>
        <form
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          className="white"
        >
          <div className="row">
            <div className="col s8 ">
              <Map
                onClick={this.onClick}
                size={this.props.size}
                battleMap={this.props.battleMap}
              />

              <div className="input-field">
                <button className="btn pink lighten-1 z-depth-20">Join</button>

                {this.props.err
                  ? this.state.errHandleCompleted
                    ? null
                    : this.errorHandler()
                  : null}
                {this.state.errMsg}
                {this.props.joinErr}
              </div>
              <div className="input-field">
                <button
                  type="button"
                  className="btn red lighten-1 z-depth-10"
                  onClick={this.handleReset}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="col s4 ">
              {this.props.size && this.props.battleMap ? (
                <Legend
                  size={this.props.size}
                  battleMap={this.props.battleMap}
                  disabled={true}
                />
              ) : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    size: state.activeGame.size,
    name: state.activeGame.name,
    creator: state.activeGame.creator,
    fleetComposition: state.auth.fleetComposition,
    auth: state.auth,
    err: state.games.err,
    battleMap: state.activeGame.battleMap,
    isFleetJoined: state.games.isFleetJoined,
    gameId: state.activeGame.gameId,
    emptyFleet: state.games.emptyFleet,
    invalidShipType: state.games.invalidShipType,
    invalidCount: state.games.invalidCount,
    invalidShipComposition: state.games.invalidShipComposition,
    forbiddenCells: state.games.forbiddenCells,
    joinErr: state.games.joinErr
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clickHandle: (cell, bm) => dispatch(clickHandle(cell, bm)),
    loadActiveGame: (gameId, settingFleetMode) =>
      dispatch(loadActiveGame(gameId, settingFleetMode)),
    joinFleet: (data, gameId) => dispatch(joinFleet(data, gameId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinGame);
