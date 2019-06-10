import React, {Component} from 'react'
import { signIn, signUp } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner } from '../../utils';

  
class SignIn extends Component {

    state = {
        username: '',
        password: '',
        isLoading: false,
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();        
        this.setState({isLoading: true})
        this.props.isNewUser ?
        this.props.signUp(this.state)
            .finally(() => this.setState({isLoading: false})):
        this.props.signIn(this.state)
            .finally(() => this.setState({isLoading: false}));
    }

    render() {
        
        if (this.state.isLoading) {
            return spinner()
        }
        const { authError, authToken, isNewUser }  = this.props
        
        const msg = isNewUser ? "Sign Up" : "Sign In"
        
        if (authToken) {
            return <Redirect to="/"/>;
        }
         
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} className="white">
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
                        <button className="btn pink lighten-1 z-depth-0">{msg}</button>
                        <div className="red-text center">
                            { authError ? <p>{ authError }</p> : null }
                        </div>
                            
                    </div>
                </form>
            </div>
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)