import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames } from '../../store/actions/gamesActions'
import AvailableGames from '../games/AvailableGamesList'
import { Link } from 'react-router-dom'


class Dashboard extends Component {
    componentDidMount () {
        this.props.getGames()
    }
    
    render() {

        const { authToken, availableGames, err } = this.props; 
        if (!authToken)return <Redirect to='/login' />
        return(
            
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <AvailableGames availableGames={availableGames}/>
                        {err}
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <Link to='/create/'>
                            <div className="btn-floating btn-large waves-effect waves-light red">
                                <i className="material-icons">add</i>
                            </div>
                            <span>        Create new game</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        authToken: state.auth.authToken,
        availableGames: state.games.availableGames,
        err: state.games.err
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getGames: () => dispatch(getGames())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)