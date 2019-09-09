import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const MUTATION_REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
    }
  }
`;

export const MUTATION_CREATE_NEW_USER = gql`
  mutation CREATE_NEW_USER($username: String, $password: String) {
    createNewUser(username: $username, password: $password) {
      __typename
      ... on PasswordTooWeak {
        errMsg
      }
      ... on UserAlreadyExists {
        errMsg
      }
      ... on CreateUserSuccess {
        token
      }
    }
  }
`;
