import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const MUTATION_CREATE_GAME = gql`
  mutation CreateGame($fleet: [[Int]]!, $size: Int, $name: String) {
    createGame(fleet: $fleet, size: $size, name: $name) {
      gameId
      fleetErrors
    }
  }
`;

export const QUERY_LOAD_ACTIVE_GAME = gql`
  query loadActiveGame($gameId: Int) {
    activeGame(gameId: $gameId)
  }
`;

export const QUERY_GET_GAME_STATE = gql`
  query gameState($gameId: Int) {
    gameStateData(gameId: $gameId) {
      state
      joiner
      turn
      shootsOfEnemy
      myDeadZone
    }
  }
`;

export const MUTATION_JOIN_GAME = gql`
  mutation joinGame($gameId: Int) {
    joinGame(gameId: $gameId) {
      result
      reason
      creator
      size
      gameId
      name
    }
  }
`;

export const QUERY_GET_GAMES = gql`
  {
    avGames {
      id
      name
      size
      creator {
        username
      }
    }
    myGames {
      id
      name
      creator {
        username
      }
      size
      joiner {
        username
      }
      turn {
        username
      }
    }
  }
`;

export const QUERY_INITIAL_FOR_JOINER = gql`
  query($gameId: Int) {
    initialForJoiner(gameId: $gameId) {
      name
      size
      creator
      gameId
    }
  }
`;

export const MUTATION_JOIN_FLEET = gql`
  mutation JoinGame($fleet: [[Int]]!, $gameId: Int!, $size: Int) {
    joinFleet(fleet: $fleet, gameId: $gameId, size: $size) {
      gameId
      fleetErrors {
        notAllowedShipCount
        forbiddenCells
        invalidShipComposition
        errMsg
      }
    }
  }
`;
