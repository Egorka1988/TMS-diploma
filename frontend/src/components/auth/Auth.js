import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  serveReceivedAuthToken,
  signUp,
  handshake
} from "../../store/actions/authActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner } from "../../utils";
import {
  LOGIN_MUTATION,
  MUTATION_CREATE_NEW_USER
} from "../../graphQL/auth/mutations";

function Auth({ isNewUser, ...props }) {
  const [state, changeFormData] = useState({ ...state, isLoading: false });
  const [showError, setShowError] = useState(false);
  const [emptUsrnmErr, setEmptUsrnmErr] = useState("");
  const [emptPswrdErr, setEmptPswrdErr] = useState("");
  const [signUpErr, setSignUpErr] = useState(null);
  const [sendSignUpCreds, resp] = useMutation(MUTATION_CREATE_NEW_USER);
  const [sendLoginCreds, { data, error }] = useMutation(LOGIN_MUTATION);
  useEffect(() => {
    handshake()();
  }, []);

  useEffect(() => {
    let clearTimeoutId = null;
    if (error) {
      clearTimeoutId = setTimeout(() => setShowError(false), 3000);
    }
    return () => {
      clearTimeoutId && clearTimeout(clearTimeoutId);
    };
  }, [error]);

  const msg = isNewUser ? "Sign Up" : "Sign In";
  const handleChange = e => {
    [e.target.id] == "username" ? setEmptUsrnmErr("") : setEmptPswrdErr("");
    changeFormData({
      ...state,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = e => {
    if (!state.username | !state.password) {
      if (!state.username) {
        setEmptUsrnmErr("Please, fill your username");
      }
      if (!state.password) {
        setEmptPswrdErr("Please, fill your password");
      }
      return;
    }

    changeFormData({ ...state, isLoading: true });
    isNewUser &&
      sendSignUpCreds({
        variables: { username: state.username, password: state.password }
      })
        .then(resp => {
          if (resp.data) {
            const signUpResult = resp.data.createNewUser;
            signUpResult.errMsg && setSignUpErr(signUpResult.errMsg);
            signUpResult.token && serveReceivedAuthToken(signUpResult.token);
          }
        })
        .finally(() => {
          changeFormData({ ...state, isLoading: false });
        });
    !isNewUser &&
      sendLoginCreds({
        variables: { username: state.username, password: state.password }
      })
        .then(data => {
          data.data && serveReceivedAuthToken(data.data.tokenAuth.token);
        })
        .finally(() => {
          changeFormData({ ...state, isLoading: false, password: "" });
        });

    setShowError(true);
  };

  if (state.isLoading) {
    return spinner();
  }
  return (
    <div className="container">
      {props.authToken && <Redirect to="/" />}
      <form onChange={e => handleChange(e)} className="white">
        <h5 className="grey-text text-darken-3">{msg}</h5>
        <div className={!state.username ? "input-field" : null}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" defaultValue={state.username} />
          <div className="red-text">{emptUsrnmErr}</div>
        </div>

        <div className="input-field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
          <div className="red-text">{emptPswrdErr}</div>
        </div>
        <div className="input-field">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn pink lighten-1 z-depth-0"
          >
            {msg}
          </button>
          <div className="red-text center">
            {error && showError && <p>Your credentials not valid</p>}
            {signUpErr && showError && <p>{signUpErr}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.authToken,
    authError: state.auth.authError,
    isNewUser: state.auth.isNewUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    serveReceivedAuthToken: token => dispatch(serveReceivedAuthToken(token)),
    signUp: creds => dispatch(signUp(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
