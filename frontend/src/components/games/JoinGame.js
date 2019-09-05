import React, { useState, useEffect } from "react";
import {
  joinFleet,
  serveJoinerInitial,
  clickHandle
} from "../../store/actions/gamesActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner, genBattleMapState, prepareFleet } from "../../utils";
import { errorHandler } from "../../errorHandler";
import { Map } from "./BattleMap";
import Legend from "./Legend";
import { QUERY_INITIAL_FOR_JOINER } from "../../graphQL/joinGame/queries";
import { MUTATION_JOIN_FLEET } from "../../graphQL/joinGame/mutations";
import { client } from "../../index";
import { EMPTY_FLEET } from "../../constants";

function JoinGame(props) {
  const [state, setState] = useState({
    isLoading: false,
    errHandleCompleted: false,
    shouldRedirectToActiveGame: false
  });
  if (!props.battleMap) {
    client
      .query({
        query: QUERY_INITIAL_FOR_JOINER,
        variables: {
          gameId: props.match.params.gameId
        }
      })
      .then(res => {
        res.data.initialForJoiner &&
          serveJoinerInitial(res.data.initialForJoiner);
      });
  }

  useEffect(() => {
    setState({ ...state, battleMap: props.battleMap });
  }, [props.battleMap]);

  const onClick = cell => {
    if (state.errHandleCompleted) {
      let resetBattleMap = state.battleMap;
      for (let i = 1; i < props.size + 1; i++) {
        for (let j = 1; j < props.size + 1; j++) {
          resetBattleMap[i][j].isError = false;
        }
      }
      setState({
        ...state,
        battleMap: resetBattleMap
      });
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
      battleMap: genBattleMapState(props.size),
      errMsg: null
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    const fleet = prepareFleet(state.battleMap);
    if (fleet.length) {
      client
        .mutate({
          mutation: MUTATION_JOIN_FLEET,
          variables: {
            fleet: fleet,
            gameId: props.gameId,
            size: props.size
          }
        })
        .then(res => {
          if (res.data) {
            if (!res.data.joinFleet.gameId) {
              const data = errorHandler(
                res.data.joinFleet.fleetErrors,
                state.battleMap
              );
              setState({
                ...state,
                errHandleCompleted: data.errHandleCompleted,
                battleMap: data.battleMap,
                errMsg: data.errMsg
              });
            } else {
              console.log("game!");
              setState({
                ...state,
                isFleetJoined: true
              });
            }
          }
        });
    } else {
      setState({
        ...state,
        errMsg: <div>{EMPTY_FLEET}</div>
      });
    }
  };

  if (state.isLoading) {
    return spinner();
  }
  if (!props.auth.authToken) {
    return <Redirect to="/auth" />;
  }
  // if () {
  //   return <Redirect to={"/active-games/" + props.gameId} />;
  // }

  return (
    <div className="container">
      {/* {state.isFleetJoined && <Redirect to={"/active-games/" + props.gameId} />} */}
      <div>
        <h5 className="grey-text text-darken-3">
          Name of the game: {props.name}
        </h5>
      </div>
      <div className="input-field">
        <h5 className="grey-text text-darken-3">
          Your opponent's name is {props.creator}
        </h5>
      </div>
      <form onSubmit={handleSubmit} className="white">
        <div className="row">
          <div className="col s8 ">
            <Map
              onClick={onClick}
              size={props.size}
              battleMap={state.battleMap ? state.battleMap : props.battleMap}
            />

            <div className="input-field">
              <button className="btn pink lighten-1 z-depth-20">Join</button>
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
            {props.size && props.battleMap ? (
              <Legend
                size={props.size}
                battleMap={props.battleMap}
                disabled={true}
              />
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    size: state.games.size,
    name: state.games.name,
    creator: state.games.creator,
    fleetComposition: state.auth.fleetComposition,
    auth: state.auth,
    err: state.games.err,
    battleMap: state.games.battleMap,
    gameId: state.games.gameId
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
