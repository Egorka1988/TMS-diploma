import gql from "graphql-tag";

export const MUTATION_JOIN_FLEET = gql`
  mutation JoinGame($fleet: [[Int]]!, $gameId: Int!, $size: Int) {
    joinFleet(fleet: $fleet, gameId: $gameId, size: $size) {
      gameId
      fleetErrors {
        notAllowedShipCount
        forbiddenCells
        notAllowedShips
        invalidShipComposition
        errMsg
      }
    }
  }
`;
