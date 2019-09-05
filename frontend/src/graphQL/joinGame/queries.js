import gql from "graphql-tag";

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
