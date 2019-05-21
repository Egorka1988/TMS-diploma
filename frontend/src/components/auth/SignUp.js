import React, {Component} from 'react'
import { signUp } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner } from '../../utils';

  
class SignUp extends Component {

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
        console.log('signup state', this.state)
        this.props.signUp(this.state)
            .finally(() => this.setState({isLoading: false}));
    }

    render() {
        if (this.state.isLoading) {
            return spinner()
        }
        if (this.props.authToken) {
            return <Redirect to="/"/>;
        }
        const { authError }  = this.props
         
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} className="white">
                    <h5 className="grey-text text-darken-3">Sign Up</h5>
                    <div className="input-field">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" />
                    </div>
                    
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password"  />
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
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
    console.log('signup state', state)
    return {
        authToken: state.authToken,
        authError: state.authError,
        username: state.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (creds) => dispatch(signUp(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)