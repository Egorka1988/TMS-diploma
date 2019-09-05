import gql from "graphql-tag";

export const MUTATION_CREATE_GAME = gql`
  mutation CreateGame($fleet: [[Int]]!, $size: Int, $name: String) {
    createGame(fleet: $fleet, size: $size, name: $name) {
      gameId
      fleetErrors
    }
  }
`;
