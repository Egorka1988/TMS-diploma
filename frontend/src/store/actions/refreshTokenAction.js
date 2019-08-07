import { configureRefreshFetch, fetchJSON } from "refresh-fetch";
import merge from "lodash/merge";
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
const fetchJSONWithToken = (url, options = {}) => {
  const token = retrieveToken();
  let optionsWithToken = options;
  if (token != null) {
    optionsWithToken = merge({}, options, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return fetchJSON(url, optionsWithToken);
};

const shouldRefreshToken = error =>
  error.response.status === 401 &&
  error.body.messages[0].message === "Token is invalid or expired";

const refreshToken = () => {
  const url = SERVICE_URL + "/rest/login/refresh/";
  return fetchJSONWithToken(url, {
    method: "POST",
    body: JSON.stringify({ refresh: localStorage.getItem("refreshAuthToken") })
  })
    .then(response => {
      saveToken(response.body["access"]);
    })
    .catch(error => {
      clearToken();
      throw error;
    });
};

export const fetch = configureRefreshFetch({
  fetch: fetchJSONWithToken,
  shouldRefreshToken,
  refreshToken
});
