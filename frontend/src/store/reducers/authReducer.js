const initState = {
  authError: null
};
const jwt = require("jsonwebtoken");
let decoded;

const authReducer = (state = initState, action) => {
  console.log("reducer", action.type);
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      if (action.authToken) {
        decoded = jwt.decode(action.authToken);
      }
      return {
        ...state,
        authToken: action.authToken,
        currUser: decoded ? decoded.username : null,
        exp: decoded ? decoded.exp : null,
        origIat: decoded ? decoded.origIat : null
      };
    case "LOGIN_ERROR":
      console.log("login failed");
      return {
        ...state,
        authError: action.authError,
        authToken: null,
        currentUser: null
      };
    case "LOGIN_SUCCESS":
      console.log("login success");
      if (action.authToken) {
        decoded = jwt.decode(action.authToken);
      }
      return {
        ...state,
        authError: null,
        authToken: action.authToken,
        currUser: decoded ? decoded.username : null,
        exp: decoded ? decoded.exp : null,
        origIat: decoded ? decoded.origIat : null
      };
    case "LOG_OUT_SUCCESS":
      console.log("user logged out");
      return {
        ...state,
        authToken: null,
        currUser: null
      };
    case "LOG_OUT_ERROR":
      return {
        ...state,
        authError: action.authError
      };

    case "INITIAL_DATA":
      return {
        ...state,
        currUser: action.currUser,
        fleetComposition: action.fleetComposition
      };
    case "SIGN_UP_SUCCESS":
      console.log("sign up success");
      return {
        ...state,
        authError: null,
        authToken: action.authToken,
        refreshAuthToken: action.refreshAuthToken,
        username: action.username
      };
    case "SIGN_UP_ERROR":
      console.log("sign up failed");
      return {
        ...state,
        authError: action.authError,
        authToken: null,
        username: action.username
      };
    case "RENDER_SIGN_UP_DATA":
      return {
        ...state,
        isNewUser: true
      };
    case "RENDER_SIGN_IN_DATA":
      return {
        ...state,
        isNewUser: false,
        authError: null
      };
    case "REFRESH_SUCCESS":
      console.log("refresh success");
      return {
        ...state,
        authToken: action.authToken
      };
    case "CLEAR_TOKEN_SUCCESS":
      console.log("clear token succeed");
      return {
        ...state,
        authToken: null,
        refreshAuthToken: null
      };
    default:
      return state;
  }
};

export default authReducer;
