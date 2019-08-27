import React, { Component, useState } from "react";
import { createGame } from "../../store/actions/gamesActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner } from "../../utils";
import { Map } from "./BattleMap";
import Legend from "./Legend";

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
const initialState = {
  name: "",
  size: 10,
  isLoading: false,
  battleMap: genBattleMapState(),
  errHandleCompleted: false
};

function NewGame(props) {
  const [state, setState] = useState(initialState);
  const handleSizeChange = e => {
    const size = parseInt(e.target.value);
    setState({
      ...state,
      size,
      battleMap: genBattleMapState(size),
      errMsg: null
    });
  };

  const handleNameChange = e => {
    setState({ ...state, name: e.target.value });
  };

  const onClick = cell => {
    if (state.errHandleCompleted) {
      let resetBattleMap = state.battleMap;
      for (let i = 1; i < state.size + 1; i++) {
        for (let j = 1; j < state.size + 1; j++) {
          resetBattleMap[i][j].isError = false;
        }
      }
      setState({ ...state, battleMap: resetBattleMap });
    }
    const [x, y] = cell;
    let battleMap = state.battleMap;

    let oldCell = battleMap[x][y];
    let newCell = { ...oldCell, isSelected: !oldCell.isSelected };

    setState({
      ...state,
      battleMap: {
        ...battleMap,
        [x]: { ...battleMap[x], [y]: newCell }
      }
    });
  };
  const handleReset = e => {
    e.preventDefault();
    setState(
      {
        ...state,
        isLoading: true,
        size: 10,
        battleMap: genBattleMapState(),
        errMsg: null
      },
      () => {
        setState({ ...state, isLoading: false });
      }
    );
  };
  const handleSubmit = e => {
    e.preventDefault();
    setState({ ...state, isLoading: true });
    props
      .createGame(state)
      .finally(() =>
        setState({ ...state, isLoading: false, errHandleCompleted: false })
      );
  };
  const errorHandler = () => {
    const emptyFleet = props.emptyFleet;
    const invalidShipType = props.invalidShipType;
    const invalidCount = props.invalidCount;
    const invalidShipComposition = props.invalidShipComposition;
    const forbiddenCells = props.forbiddenCells;
    let msg = [];
    let battleMap = state.battleMap;

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
    setState({
      ...state,
      errHandleCompleted: true,
      battleMap: battleMap,
      errMsg: msg
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="white">
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
            value={state.size}
            onChange={handleSizeChange}
          />
        </div>

        <div className="input-field">
          <input
            type="text"
            id="name"
            placeholder="Name of the game"
            value={state.name}
            onChange={handleNameChange}
          />
        </div>
        <div className="row">
          <div className="col s8 ">
            <Map
              onClick={onClick}
              size={state.size}
              battleMap={state.battleMap}
            />

            <div className="input-field">
              <button className="btn pink lighten-1 z-depth-20">Create</button>

              {props.err
                ? state.errHandleCompleted
                  ? null
                  : errorHandler()
                : null}
              {state.errMsg}
            </div>
            <div className="input-field">
              <button
                type="button"
                className="btn red lighten-1 z-depth-10"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="col s4 ">
            <Legend size={state.size} />
          </div>
        </div>
      </form>
    </div>
  );
}


    // if (this.state.isLoading) {
    //   return spinner();
    // }
    // if (!this.props.auth.authToken) {
    //   return <Redirect to="/auth" />;
    // }
    // if (this.props.gameId) {
    //   return <Redirect to={"/active-games/" + this.props.gameId} />;
    // }
   

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
