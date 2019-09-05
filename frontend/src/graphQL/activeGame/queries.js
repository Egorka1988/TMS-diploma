import gql from "graphql-tag";

export const QUERY_LOAD_ACTIVE_GAME = gql`
  query loadActiveGame($gameId: Int) {
    activeGame(gameId: $gameId) {
      myDeadZone
      fleet
      myShoots
      gameState
      enemyShoots
      enemyDeadZone
      currUser
      gameDetails {
        creator {
          username
        }
        joiner {
          username
        }
        turn {
          username
        }
        winner {
          username
        }
        name
        size
        id
      }
    }
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
