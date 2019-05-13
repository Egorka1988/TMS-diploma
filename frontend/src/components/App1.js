import React, { Component } from "react";
import { BrowserRouter, Switch, Routeb } from 'react-router-dom'
import SignIn from './auth/sign_in'

import '../styles/app.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                <h1>AAAAAAAAAAA</h1>
                    <Navbar />
                    <Switch>
//                        <Route exact path='/' component={Dashboard} />
//                        <Route exact path='/project/:id' component={ProjectDetails} />
                        <Route exact path='/signin' component={SignIn} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;