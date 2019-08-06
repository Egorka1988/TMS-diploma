import React, { Component } from "react";
import { createGame } from "../../store/actions/gamesActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner } from "../../utils";
import { Map } from "./BattleMap";
import Legend from "./Legend";

export const MyContext = React.createContext(1);

export const genBattleMapState = (size = 10) => {
  let battleMap = {};
  for (let i = 1; i < size + 1; i++) {
    battleMap[i] = {};
    for (let j = 1; j < size + 1; j++) {
      battleMap[i][j] = { isSelected: false };
    }
  }
  return battleMap;
};

class NewGame extends Component {
  state = {
    name: "",
    size: 10,
    isLoading: false,
    battleMap: genBattleMapState(),
    errHandleCompleted: false
  };

  handleSizeChange = e => {
    const size = parseInt(e.target.value);
    this.setState({ size, battleMap: genBattleMapState(size), errMsg: null });
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value });
  };

  onClick = cell => {
    if (this.state.errHandleCompleted) {
      let resetBattleMap = this.state.battleMap;
      for (let i = 1; i < this.state.size + 1; i++) {
        for (let j = 1; j < this.state.size + 1; j++) {
          resetBattleMap[i][j].isError = false;
        }
      }
      this.setState({ battleMap: resetBattleMap });
    }
    const [x, y] = cell;
    let battleMap = this.state.battleMap;

    let oldCell = battleMap[x][y];
    let newCell = { ...oldCell, isSelected: !oldCell.isSelected };

    this.setState({
      battleMap: {
        ...battleMap,
        [x]: { ...battleMap[x], [y]: newCell }
      }
    });
  };
  handleReset = e => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
        size: 10,
        battleMap: genBattleMapState(),
        errMsg: null
      },
      () => {
        this.setState({ isLoading: false });
      }
    );
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    this.props
      .createGame(this.state)
      .finally(() =>
        this.setState({ isLoading: false, errHandleCompleted: false })
      );
  };

  errorHandler = () => {
    const emptyFleet = this.props.emptyFleet;
    const invalidShipType = this.props.invalidShipType;
    const invalidCount = this.props.invalidCount;
    const invalidShipComposition = this.props.invalidShipComposition;
    const forbiddenCells = this.props.forbiddenCells;
    let msg = [];
    let battleMap = this.state.battleMap;

    if (emptyFleet) {
      msg.push(<div key="emptyFleet">{emptyFleet}</div>);
    }
    if (invalidCount) {
      msg.push(<div>The ships' count is not correct. Check the schema. </div>);
    }
    if (invalidShipType) {
      for (const ship of invalidShipType) {
        msg.push(
          <div key={"invalidShipType" + ship}>
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
          <div key={"invalidShipComposition" + ship}>
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
          <div key={"forbiddenCells" + cell}>
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
    if (this.props.gameId) {
      return <Redirect to={"/active-games/" + this.props.gameId} />;
    }
    return (
      <div className="container">
        <form
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          className="white"
        >
          <h5 className="grey-text text-darken-3">New Game</h5>
          <div className="range-field">
            <span>
              <h6 className="grey-text text-darken-3">Size</h6>
            </span>
            <input
              type="range"
              id="size"
              max="15"
              min="10"
              value={this.state.size}
              onChange={this.handleSizeChange}
            />
          </div>

          <div className="input-field">
            <input
              type="text"
              id="name"
              placeholder="Name of the game"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </div>
          <div className="row">
            <div className="col s8 ">
              <Map
                onClick={this.onClick}
                size={this.state.size}
                battleMap={this.state.battleMap}
              />

              <div className="input-field">
                <button className="btn pink lighten-1 z-depth-20">
                  Create
                </button>

                {this.props.err
                  ? this.state.errHandleCompleted
                    ? null
                    : this.errorHandler()
                  : null}
                {this.state.errMsg}
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
              <Legend size={this.state.size} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    err: state.games.err,
    gameId: state.games.gameId,
    emptyFleet: state.games.emptyFleet,
    invalidShipType: state.games.invalidShipType,
    invalidCount: state.games.invalidCount,
    invalidShipComposition: state.games.invalidShipComposition,
    forbiddenCells: state.games.forbiddenCells
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createGame: data => dispatch(createGame(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGame);
