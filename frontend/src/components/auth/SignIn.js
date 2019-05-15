import React, {Component} from 'react'

class SignIn extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        async function ping_login () {
            try {
                const res = await fetch('http://127.0.0.1:8000/login/');
                const todos = await res.json();

            } catch (e) {
                console.log(e);
            }
        }
        ping_login();
        

        console.log('submit')
    
    }
    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Sign In</h5>
                    <div className="input-field">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" />
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Login</button>
                        <div className="red-text center">
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default SignIn;