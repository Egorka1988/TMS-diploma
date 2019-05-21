import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'

const Navbar = (props) => {
    console.log('navbar', props)
    const { authToken } = props;
    const links = authToken ? <SignedInLinks /> : <SignedOutLinks />;
    return (
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
                <Link to='/' className="brand-logo">Sea Battle</Link>
                { links }
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        authToken: state.auth.authToken,
        username: state.username
    }
}
export default connect(
    mapStateToProps
)(Navbar)