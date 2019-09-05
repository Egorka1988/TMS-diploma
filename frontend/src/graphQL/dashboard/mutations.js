import gql from "graphql-tag";


export const MUTATION_JOIN_GAME = gql`
  mutation joinGame($gameId: Int) {
    joinGame(gameId: $gameId) {
      failMessage
      game {
        id
        creator {
          username
        }
        size
        name
      }
    }
  }
`;
