import React, { useState, useEffect } from "react";
import { serveCreationData } from "../../store/actions/gamesActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner, genBattleMapState, prepareFleet } from "../../utils";
import { errorHandler } from "../../errorHandler";
import { MUTATION_CREATE_GAME } from "../../gql";
import { Map } from "./BattleMap";
import Legend from "./Legend";
import { useMutation } from "react-apollo";
import { EMPTY_FLEET } from "../../constants";


const initialState = {
  name: "",
  size: 10,
  isLoading: false,
  battleMap: genBattleMapState(),
  errHandleCompleted: false
};

function NewGame(props) {
  const [state, setState] = useState(initialState);
  const [fleetErr, setFleeterr] = useState(null);
  const [createGame, { data, error }] = useMutation(MUTATION_CREATE_GAME);
  useEffect(() => {
    let err;
    if (data) {
      err = JSON.parse(data.createGame.fleetErrors);
      const gameId = data.createGame.gameId
      gameId && serveCreationData(gameId);
    }
    err && setFleeterr(err);
  }, [data, error]);

  useEffect(() => {
    fleetErr && errorHandler(fleetErr, state, setState);
  }, [fleetErr]);

  const handleSizeChange = e => {
    const size = parseInt(e.target.value);
    setState({
      ...state,
      size,
      battleMap: genBattleMapState(size),
      errMsg: null
    });
    setFleeterr(null);
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
      errHandleCompleted: true,
      battleMap: {
        ...battleMap,
        [x]: { ...battleMap[x], [y]: newCell }
      }
    });
  };
  const handleReset = e => {
    setState({
      ...state,
      size: 10,
      battleMap: genBattleMapState(),
      errMsg: null
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setFleeterr(null);

    const fleet = prepareFleet(state.battleMap);

    if (fleet.length) {
      createGame({
        variables: {
          size: state.size,
          fleet: fleet,
          name: state.name
        }
      }).finally(() =>
        setState({ ...state, isLoading: false, errHandleCompleted: false })
      );
    } else {
      setFleeterr({
        emptyFleet:
          EMPTY_FLEET
      });
    }
  };

  if (state.isLoading) {
    return spinner();
  }
  if (!props.auth.authToken) {
    return <Redirect to="/auth" />;
  }
  if (props.gameId) {
    return <Redirect to={"/active-games/" + props.gameId} />;
  }
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

const mapStateToProps = state => {
  return {
    auth: state.auth,
    err: state.games.err,
    gameId: state.games.gameId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    serveCreationData: (gameId) => dispatch(serveCreationData(gameId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGame);
