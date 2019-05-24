import React, {Component} from 'react'
import { signIn } from '../../store/actions/authActions'
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
        this.props.signIn(this.state)
            .finally(() => this.setState({isLoading: false}));
    }

    render() {
        if (this.state.isLoading) {
            return spinner()
        }
        if (this.props.auth.authToken) {

            return <Redirect to="/"/>;
        }
        const { authError }  = this.props
         
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} className="white">
                    <h5 className="grey-text text-darken-3">Sign In</h5>
                    <div className="input-field">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" />
                    </div>
                    
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password"  />
                    </div>
                    <div>
                        <label pointerEvents="auto">
                            <input type="checkbox" id='remember_user' />
                            <span>Remember me (unsafe)</span>
                        </label>
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Login</button>
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
        auth: state.auth,
        authError: state.authError,
        username: state.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)