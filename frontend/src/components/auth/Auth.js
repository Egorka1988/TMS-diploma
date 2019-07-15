import React, { useState, useEffect } from 'react'
import { signIn, signUp } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner } from '../../utils';

function Auth(props){
    const initialState = {
        username: '',
        password: '',
        isLoading: false,
    }
    const [state, changeFormData] = useState(initialState)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        let clearTimeontId = null;
        if (props.authError) {
            clearTimeontId = setTimeout(() => setShowError(false), 2000);
        }     
        return () => {
            clearTimeontId && clearTimeout(clearTimeontId);
        }
    }, [props.authError])

    const msg = props.isNewUser ? "Sign Up" : "Sign In"
    const handleChange = (e) => {
        changeFormData({
            ...state, 
            [e.target.id]: e.target.value
        })
    }
    const handleSubmit = (e) => {      
        changeFormData({...state, isLoading: true})
        props.isNewUser ?
        props.signUp(state)
            .finally(() =>{ changeFormData({...state, isLoading: false})}):
        props.signIn(state)
            .finally(() => { changeFormData({...state, isLoading: false})});

        setShowError(true)
    }
    if (state.isLoading) {
        return spinner()
    }
    if (props.authToken) {
        return <Redirect to="/"/>;
    }
    
    return (
        <div className="container">
            <form onChange={(e) => handleChange(e)} className="white">
                <h5 className="grey-text text-darken-3">{msg}</h5>
                <div className="input-field">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" />
                </div>
                
                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"  />
                </div>
                <div className="input-field">
                    <button onClick={handleSubmit} className="btn pink lighten-1 z-depth-0">{msg}</button>
                    <div className="red-text center">
                        { showError && <p>{ props.authError }</p> }
                    </div>
                        
                </div>
            </form>
        </div>
    )

}  


const mapStateToProps = (state) => {
    return {
        authToken: state.auth.authToken,
        authError: state.auth.authError,
        isNewUser: state.auth.isNewUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds)),
        signUp: (creds) => dispatch(signUp(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)