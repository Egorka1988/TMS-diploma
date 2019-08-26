
import { store } from "../../index";

const retrieveToken = () => store.getState().auth.authToken;

const saveToken = token => {
  store.dispatch({
    type: "REFRESH_SUCCESS",
    authToken: token
  });
};

const clearToken = () => {
  store.dispatch({
    type: "CLEAR_TOKEN_SUCCESS"
  });
};