import { requestWrapper } from "../../utils";
import { store } from "../../index";

export const handshake = () => {
  const request = requestWrapper("GET", SERVICE_URL + "/");
  return async () => {
    const resp = await fetch(request);
    return resp;
  };
};

export const serveToken = token => {
  store.dispatch({
    type: "LOGIN_SUCCESS",
    authToken: token
  });
};

export const signOut = () => {
  return store.dispatch({
    type: "LOG_OUT_SUCCESS"
  });
};

export const signUp = credentials => {
  return async (dispatch, getState) => {
    dispatch({
      type: "LOGIN_ERROR",
      authError: null
    });

    const request = requestWrapper(
      "POST",
      SERVICE_URL + "/rest/signup/",
      credentials
    );
    const response = await fetch(request).catch(error => {
      dispatch({
        type: "SIGN_UP_ERROR",
        authError: error.body.username || error.body.password,
        authToken: null
      });
    });
    const data = await response.body;
    if (response.response.ok) {
      dispatch({
        type: "SIGN_UP_SUCCESS",
        authToken: data.access,
        username: data.username
      });
      dispatch(initialLoad());
    }
  };
};

export const signData = act => {
  return async (dispatch, getState) => {
    if (act === "signUp") {
      dispatch({
        type: "RENDER_SIGN_UP_DATA"
      });
    }
    if (act === "signIn") {
      dispatch({
        type: "RENDER_SIGN_IN_DATA"
      });
    }
  };
};
