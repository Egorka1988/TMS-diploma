import gql from "graphql-tag";

export const QUERY_GET_AVAILABLE_GAMES = gql`
  query GET_AVAILABLE_GAMES($avGamesAfter: String, $avGamesFirst: Int) {
    availableGamesCount
    availableGames(after: $avGamesAfter, first: $avGamesFirst) {
      edges {
        cursor
        node {
          gameId
          creator {
            username
          }
          size
          name
        }
      }
    }
  }
`;

export const QUERY_GET_ALL_MY_GAMES = gql`
  query GET_ALL_MY_GAMES(
    $allMyGamesAfter: String
    $allMyGamesFirst: Int
  ) {
    allMyGamesCount
    allMyGames(after: $allMyGamesAfter, first: $allMyGamesFirst) {
      edges {
        cursor
        node {
          gameId
          name
          size
          creator {
            username
          }
          joiner {
            username
          }
          turn {
            username
          }
        }
      }
    }
  }
`;
