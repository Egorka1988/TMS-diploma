import React from "react";
import style from "./styles.css";

export const localStoreTokenManager = store => {
  let currentToken = localStorage.getItem("authToken") || null;

  store.dispatch({
    type: "SET_AUTH_TOKEN",
    authToken: currentToken
  });

  return () => {
    console.log("localStore");
    const newToken = store.getState().auth.authToken;

    if (newToken === null) {
      // logout flow
      localStorage.removeItem("authToken");
    } else if (newToken !== currentToken) {
      localStorage.setItem("authToken", newToken);
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
  myHeaders.append("Access-Control-Request-Headers", "set-cookie");
  const token = "Bearer " + localStorage.getItem("authToken");
  myHeaders.append("Authorization", token);
  myHeaders.append("X-Csrftoken", getTokenCsrf());
  const myInit = {
    method: method,
    mode: "cors",
    credentials: "include",
    headers: myHeaders,
    cache: "default",
    body: bodyData ? JSON.stringify(bodyData) : null
  };

  return new Request(url, myInit);
};

export const getTokenCsrf = () => {
  const CookList = document.cookie.split(";");
  for (let i = 0; i < CookList.length; i++) {
    if (CookList[i].includes("csrftoken=")) {
      const token = CookList[i].slice(CookList[i].indexOf("=") + 1);
      return token;
    }
  }
};

export const prepareFleet = data => {
  let fleet = [];
  const size = Object.keys(data).length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      data[i + 1][j + 1].isSelected ? fleet.push([i + 1, j + 1]) : null;
    }
  }
  return fleet;
};

export const genBattleMapState = (size = 10) => {
  let battleMap = {};
  for (let i = 1; i < size + 1; i++) {
    battleMap[i] = {};
    for (let j = 1; j < size + 1; j++) {
      battleMap[i][j] = { isSelected: false };
    }
  }
  return battleMap;
};
