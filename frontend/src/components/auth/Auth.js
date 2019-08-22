import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { serveToken, signUp, handshake } from "../../store/actions/authActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner } from "../../utils";

const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

function Auth(props) {
  const [state, changeFormData] = useState({ isLoading: false });
  const [showError, setShowError] = useState(false);
  const [emptUsrnmErr, setEmptUsrnmErr] = useState("");
  const [emptPswrdErr, setEmptPswrdErr] = useState("");

  const [sendCreds, { data, error }] = useMutation(LOGIN_MUTATION);
  useEffect(() => {
    handshake()();
  }, []);

  useEffect(() => {
    let clearTimeontId = null;
    if (error) {
      clearTimeontId = setTimeout(() => setShowError(false), 3000);
    }
    return () => {
      clearTimeontId && clearTimeout(clearTimeontId);
    };
  }, [error]);

  if (props.authToken) {
    return <Redirect to="/" />;
  }

  const msg = props.isNewUser ? "Sign Up" : "Sign In";
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
    props.isNewUser
      ? props.signUp(state).finally(() => {
          changeFormData({ ...state, isLoading: false });
        })
      : sendCreds({
          variables: { username: state.username, password: state.password }
        })
          .then(data => {
            data.data && serveToken(data.data.tokenAuth.token);
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
            {error && showError && <p>{error.graphQLErrors[0].message}</p>}
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
    serveToken: token => dispatch(serveToken(token)),
    signUp: creds => dispatch(signUp(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
