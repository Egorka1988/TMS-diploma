import gql from "graphql-tag";


export const MUTATION_SHOOT = gql`
  mutation Shoot($gameId: Int, $shoot: [Int]) {
    shoot(shoot: $shoot, gameId: $gameId) {
      shootError
      shootResult
      deadZone
      deadShip
      state
    }
  }
`;
