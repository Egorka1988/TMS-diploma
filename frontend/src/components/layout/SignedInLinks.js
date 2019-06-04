import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => {
    return (
        <ul className="right">
            <li>
                <NavLink to='login' onClick={props.signOut}>
                    Log Out
                </NavLink>
            </li>
            <li>
                <NavLink to='/' className='btn btn-floating btn-large pink lighten-1' />
            </li>
            <li>
                <NavLink to='/'>
                    {props.username} 
                </NavLink>
            </li>
        </ul>
    )
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.currentUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks)