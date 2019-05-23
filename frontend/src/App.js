import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SignIn from './components/auth/SignIn'
import Dashboard from './components/dashboard/Dashboard'
import Navbar from './components/layout/Navbar'
import Profile from './components/auth/Profile'
import SignUp from './components/auth/SignUp'
import NewGame from './components/games/NewGame'
import ActiveGame from './components/games/ActiveGame'

class App extends Component {

    render() {
        console.log('app props', this.props)
        return (
            <BrowserRouter>
            <Navbar />
                <div className="App">
                        <Route exact path='/' component={Dashboard} />
                        <Route path='/login' component={SignIn} />
                        <Route path='/signup' component={SignUp} />
                        <Route path='/profile' component={Profile} />
                        <Route path='/create' component={NewGame} />
                        <Route path='/active-game' component={ActiveGame} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;