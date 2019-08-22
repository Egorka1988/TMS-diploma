import { requestWrapper } from "../../utils";
import { fetch } from "./refreshTokenAction";

export const getGames = () => {
  return async (dispatch, getState) => {
    const request = requestWrapper("GET", SERVICE_URL + "/rest/games/");

    const response = await fetch(request);

    const data = await response.body;

    if (response.response.ok) {
      console.log(data.myGames)
      dispatch({
        type: "GAMES_LIST",
        availableGames: data.games.avGames,
        myGames: data.games.myGames
      });
    } else {
      dispatch({
        type: "GAMES_ERROR",
        err: data.detail
      });
    }
  };
};

export const createGame = stateData => {
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
      size: stateData.size,
      name: stateData.name
    };
    const request = requestWrapper(
      "POST",
      SERVICE_URL + "/rest/games/",
      bodyData
    );

    const response = await fetch(request).catch(error => {
      dispatch({
        type: "GAME_CREATE_ERROR",
        err: "error",
        emptyFleet: error.body["fleet"],
        invalidShipType: error.body["notAllowedShips"],
        invalidCount: error.body["notAllowedShipCount"],
        invalidShipComposition: error.body["invalidShipComposition"],
        forbiddenCells: error.body["forbiddenCells"]
      });
    });
    const respdata = await response;
    if (response.response.ok) {
      dispatch({
        type: "GAME_CREATE_SUCCESS",
        gameId: respdata.body.id
      });
    }
  };
};

export const shoot = (cell, gameId) => {
  return async (dispatch, getState) => {
    const request = requestWrapper(
      "PATCH",
      SERVICE_URL + "/rest/games/" + gameId + "/shoot/",
      { shoot: cell }
    );

    const response = await fetch(request).catch(error => {
      dispatch({
        type: "SHOOT_RESULT_ERROR",
        err: error.body.detail
      });
    });
    const respdata = await response.body;

    if (response.response.ok) {
      dispatch({
        type: "SHOOT_RESULT_SUCCESS",
        state: respdata.state,
        shootResult: respdata.shoot,
        lastShoot: cell,
        enemyDeadZone: respdata.deadZone,
        deadShip: respdata.deadShip
      });
    }
  };
};

export const loadActiveGame = (gameId, settingFleetMode = false) => {
  return async (dispatch, getState) => {
    const request = requestWrapper(
      "GET",
      SERVICE_URL + "/rest/games/" + gameId + "/initial-state/"
    );
    const response = await fetch(request);
    const data = await response.body;

    if (response.response.ok) {
      dispatch({
        type: "LOAD_ACTIVE_GAME",
        ...data,
        settingFleetMode: settingFleetMode
      });
    }
  };
};

export const joinGame = game => {
  return async (dispatch, getState) => {
    const request = requestWrapper(
      "POST",
      SERVICE_URL + "/rest/games/" + game.id + "/join/"
    );

    const response = await fetch(request).catch(error => {
      dispatch({
        type: "JOIN_ERROR",
        joinErr: error.body
      });
    });

    if (response.response.ok) {
      dispatch({
        type: "JOIN_SUCCESS",
        size: game.size,
        name: game.name,
        creator: game.creator,
        gameId: game.id,
        joinErr: null
      });
      return game.id;
    }
  };
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

export const getGameState = gameId => {
  return async (dispatch, getState) => {
    const request = requestWrapper(
      "GET",
      SERVICE_URL + "/rest/games/" + gameId + "/state/"
    );
    const response = await fetch(request);
    const respdata = await response.body;

    if (response.response.ok) {
      dispatch({
        type: "GAME_STATE",
        turn: respdata.turn,
        joiner: respdata.joiner,
        gameState: respdata.state,
        enemyShoots: respdata.shootsOfEnemy,
        myDeadZone: respdata.myDeadZone
      });
    }
  };
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
