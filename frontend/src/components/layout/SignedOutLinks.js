import React from 'react'
import { NavLink } from 'react-router-dom'


const SignedOutLinks = (props) => {
    const {signInLink , signUpLink} = props
    return (
        <ul className="right">
            <li><NavLink to='/auth' onClick={signUpLink}>Signup</NavLink></li>
            <li><NavLink to='/auth' onClick={signInLink}>Login</NavLink></li>
        </ul>
    )
}

export default SignedOutLinks