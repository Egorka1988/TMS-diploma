import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SignIn from './components/auth/SignIn'
import Dashboard from './components/dashboard/Dashboard'
import Navbar from './components/layout/Navbar'
import Profile from './components/auth/Profile'
import SignUp from './components/auth/SignUp'
import NewGame from './components/games/NewGame'
import JoinGame from './components/games/JoinGame'
import ActiveGame from './components/games/ActiveGame'
import { connect } from "react-redux"

class App extends Component {

    render() {
        return (
            <BrowserRouter>
            
                <div className="App">
                    <Navbar />
                    <Route exact path='/' component={Dashboard} />
                    <Route path='/login' component={SignIn} />
                    <Route path='/signup' component={SignUp} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/create' component={NewGame} />
                    <Route path={'/join/:gameId'} component={JoinGame} />
                    <Route path='/active-games/:gameId' component={ActiveGame} />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        gameId: state.games.gameId,
    }
}

export default connect(mapStateToProps)(App)