import React from "react";
import style from "./styles.css";

export const localStoreTokenManager = store => {
  let currentToken = localStorage.getItem("authToken") || null;
  let currRefreshToken = localStorage.getItem("refreshAuthToken") || null;

  store.dispatch({
    type: "SET_AUTH_TOKEN",
    authToken: currentToken,
    refreshAuthToken: currRefreshToken
  });

  return () => {
    const newToken = store.getState().auth.authToken;
    const newRefreshToken = store.getState().auth.refreshAuthToken;

    if (newToken === null) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshAuthToken");
    } else if (newToken !== currentToken) {
      localStorage.setItem("authToken", newToken);
      newRefreshToken &&
        localStorage.setItem("refreshAuthToken", newRefreshToken);
    }
  };
};

export const spinner = () => {
  return (
    <div className="SpinnerStyle">
      <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-blue-only">
          <div className="circle-clipper left">
            <div className="circle" />
          </div>
          <div className="gap-patch">
            <div className="circle" />
          </div>
          <div className="circle-clipper right">
            <div className="circle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const requestWrapper = (method, url, bodyData) => {
  const myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");
  const myInit = {
    method: method,
    mode: "cors",
    headers: myHeaders,
    cache: "default",
    body: bodyData ? JSON.stringify(bodyData) : null
  };

  return new Request(url, myInit);
};
