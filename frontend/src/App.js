import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SignIn from './components/auth/SignIn'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                        <Route path='/' component={SignIn} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;