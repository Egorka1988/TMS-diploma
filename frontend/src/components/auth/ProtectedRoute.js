import React, { Component, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { MUTATION_REFRESH_TOKEN } from "../../graphQL/auth/mutations";
import { ApolloConsumer } from "react-apollo";

function ProtectedRoute({ authToken, path, exact, component, ...props }) {
  const currentPath = document.location.pathname;
  if (!authToken && path === currentPath) {
    console.log("absent token. Redirect to Auth... ");
    return (
      <Redirect
        to={{
          pathname: "/auth",
          state: { from: path }
        }}
      />
    );

    // if (Date.now() - props.exp >= 0) {
    // }
  } else {
    return <Route exact={exact} path={path} component={component} />;
  }
  const delta = exp - origIat - 10; //seconds
  let timerId = setTimeout(
    refreshToken({
      variables: { token: authToken }
    }),
    delta * 1000
  );
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.authToken,
    exp: state.auth.exp,
    origIat: state.auth.origIat
  };
};

export default connect(mapStateToProps)(ProtectedRoute);
