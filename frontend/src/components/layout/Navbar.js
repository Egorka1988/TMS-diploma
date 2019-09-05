import React, { Component } from "react";
import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from "react-redux";
import { signData } from "../../store/actions/authActions";

class Navbar extends Component {
  signUpLink = () => {
    console.log("signUp clicked");
    this.props.signData("signUp");
  };

  signInLink = () => {
    console.log("signIn clicked");
    this.props.signData("signIn");
  };

  render() {
    const { authToken, currUser } = this.props;
    return (
      <nav className="nav-wrapper grey darken-3">
        <div className="container">
          <Link
            to="/"
            className="brand-logo"
          >
            Sea Battle
          </Link>
          {authToken && currUser && <SignedInLinks />}
          {!authToken && (
            <SignedOutLinks
              signUpLink={this.signUpLink}
              signInLink={this.signInLink}
            />
          )}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    currUser: state.auth.currUser,
    authToken: state.auth.authToken
  };
};
const mapDispatchToProps = dispatch => ({
  signData: data => dispatch(signData(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
