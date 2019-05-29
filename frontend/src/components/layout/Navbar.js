import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'

const Navbar = (props) => {
    const { authToken } = props;

    return (
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
                <Link to='/' className="brand-logo">Sea Battle</Link>
                { authToken  && props.currentUser &&<SignedInLinks /> }
                { !authToken  && <SignedOutLinks /> }
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser,
        authToken: state.auth.authToken,
    }
}
export default connect(
    mapStateToProps
)(Navbar)