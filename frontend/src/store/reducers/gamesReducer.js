import { genBattleMapState } from "../../utils";

const initState = {
  err: null
};

const gamesReducer = (state = initState, action) => {
  switch (action.type) {
    case "FLEET_COMPOSITION":
      return {
        ...state,
        fleetComposition: action.fleetComposition
      };
    case "FLEET_COMPOSITION_ERROR":
      console.log(action.err);
      return {
        ...state,
        err: action.err
      };
    case "GAMES_LIST":
      console.log("Load games completed");
      return {
        ...state,
        availableGames: action.availableGames,
        myGames: action.myGames
      };
    case "AVAILABLE_GAMES_ERROR":
      console.log("Load games failed");
      return {
        ...state,
        err: action.err
      };
    case "GAME_CREATE_SUCCESS":
      console.log("Game created");
      return {
        ...state,
        gameId: action.gameId,
        err: null
      };
    case "GAME_CREATE_ERROR":
      console.log("Create game failed");

      return {
        ...state,
        err: "error"
      };
    case "JOIN_SUCCESS":
      console.log("Join success");
      console.log(action);
      return {
        ...state,
        size: action.size,
        name: action.name,
        creator: action.creator,
        gameId: action.gameId,
        redirectFromDashboard: true,
        joinErr: null,
        battleMap: action.size && genBattleMapState(action.size)
      };
    case "AVAILABLE_GAMES_LIST":
      return {
        ...state,
        avGames: action.avGames,
        avGamesTotal: action.avGamesTotal,
        avGamesPageInfo: action.avGamesPageInfo
      };
    case "ALL_MY_GAMES_LIST":
      return {
        ...state,
        allMyGames: action.myGames,
        allMyGamesTotal: action.allMyGamesTotal,
        allMyGamesPageInfo: action.allMyGamesPageInfo
      };

    case "JOIN_INITIAL_DATA":
      console.log("JOIN_INITIAL_DATA");
      return {
        name: action.name,
        size: action.size,
        creator: action.creator,
        gameId: action.gameId,
        battleMap: genBattleMapState(action.size)
      };
    case "JOIN_ERROR":
      console.log("Join failed");
      return {
        ...state,
        joinErr: action.joinErr
      };
    case "GAME_JOIN_FLEET_SUCCESS":
      console.log("Join fleet success");
      return {
        ...state,
        isFleetJoined: action.isFleetJoined
      };
    case "GAME_JOIN_FLEET_ERROR":
      console.log("Join fleet failed");
      return {
        ...state,
        err: "error"
      };
    case "RESTRICT_REDIRECT":
      return ({
        ...state,
        redirectFromDashboard: false
      });
    default:
      return state;
  }
};

export default gamesReducer;
