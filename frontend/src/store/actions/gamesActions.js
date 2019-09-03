import { requestWrapper } from "../../utils";
import { store } from "../../index";

export const initialLoad = async () => {
  const request = requestWrapper(
    "POST",
    SERVICE_URL + "/graphql/",
    QUERY_FLEET_COMPOSITION
  );

  const response = await fetch(request);
  const data = await response.body;

  return store.dispatch({
    type: "FLEET_COMPOSITION",
    fleetComposition: data.fleetComposition
  });
};

export const serveCreationData = gameId => {
  return store.dispatch({
    type: "GAME_CREATE_SUCCESS",
    gameId: gameId
  });
};

export const serveJoinerInitial = data => {
  return store.dispatch({
    type: "JOIN_INITIAL_DATA",
    name: data.name,
    size: data.size,
    creator: data.creator,
    gameId: data.gameId
  });
};

export const shoot = (data, cell) => {
  if (data.shootError) {
    return store.dispatch({
      type: "SHOOT_RESULT_ERROR",
      shootError: data.shootError
    });
  }
  return store.dispatch({
    type: "SHOOT_RESULT_SUCCESS",
    state: data.state,
    shootResult: data.shootResult,
    lastShoot: cell,
    enemyDeadZone: data.deadZone,
    deadShip: data.deadShip
  });
};

export const serveData = (rawData, settingFleetMode = false) => {
  let data = {};
  if (rawData) {
    if (rawData.activeGame) {
      data = rawData.activeGame;
    }
  }

  return store.dispatch({
    type: "LOAD_ACTIVE_GAME",
    ...data,
    settingFleetMode: settingFleetMode
  });
};

export const handleJoinGameResponse = data => {

  if (data.game) {
    return store.dispatch({
      type: "JOIN_SUCCESS",
      size: data.game.size,
      name: data.game.name,
      creator: data.game.creator.username,
      gameId: data.game.gameId
    });
  }
  if (data.failMessage) {
    return store.dispatch({
      type: "JOIN_ERROR",
      joinErr: data.failMessage
    });
  }
};

export const joinFleet = (stateData, gameId) => {
  return async (dispatch, getState) => {
    let fleet = [];
    const size = Object.keys(stateData.battleMap).length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        stateData.battleMap[i + 1][j + 1].isSelected
          ? fleet.push([i + 1, j + 1])
          : null;
      }
    }
    const bodyData = {
      fleet,
      size: stateData.size
    };
    const request = requestWrapper(
      "POST",
      SERVICE_URL + "/rest/games/" + gameId + "/join_fleet/",
      bodyData
    );

    const response = await fetch(request).catch(error => {
      dispatch({
        type: "GAME_JOIN_FLEET_ERROR",
        err: "error",
        joinErr: error.body["err"],
        emptyFleet: error.body["fleet"],
        invalidShipType: error.body["notAllowedShips"],
        invalidCount: error.body["notAllowedShipCount"],
        invalidShipComposition: error.body["invalidShipComposition"],
        forbiddenCells: error.body["forbiddenCells"]
      });
    });

    if (response.response.ok) {
      dispatch({
        type: "GAME_JOIN_FLEET_SUCCESS",
        isFleetJoined: true
      });
    }
  };
};

export const updateGame = data => {
  return store.dispatch({
    type: "GAME_STATE",
    turn: data.turn,
    joiner: data.joiner,
    gameState: data.state,
    enemyShoots: data.shootsOfEnemy,
    myDeadZone: data.myDeadZone
  });
};

export const clickHandle = (cell, battleMap) => {
  return async (dispatch, getState) => {
    dispatch({
      type: "FLEET_SET",
      cell: cell,
      battleMap: battleMap
    });
  };
};
