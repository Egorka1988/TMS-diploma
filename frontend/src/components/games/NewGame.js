import React, {Component} from 'react'
import { createGame } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner} from '../../utils';
import { Map } from './BattleMap'
import { Legend } from './Legend'


const genBattleMapState = (size=10) => {
   
    let battleMap = {}
    for (let i=1; i<size+1; i++) {
        battleMap[i] = {}
        for (let j=1; j<size+1; j++) {
            battleMap[i][j] = {isSelected: false, color: 'white'}
        }
    }
    return battleMap
}


class NewGame extends Component {

    state = {
        name: '',
        size: 10,
        isLoading: false,
        fleet: [],
        battleMap: genBattleMapState()
    }

    
    handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        this.setState({size})
        this.setState({battleMap : genBattleMapState(size)})

    }

    onClick = (e) => { 
        const cell = e.target.getAttribute('index').split(',')
        const battleMap = this.state.battleMap
        let myOldValue = battleMap[cell[0]][cell[1]]
        let myNewValue = {}
        if (myOldValue.isSelected) { 
            myNewValue = {isSelected : false, color: 'white'}
        } else {
            myNewValue = {isSelected : true, color: 'lime'}
        }
        battleMap[cell[0]][cell[1]] = myNewValue
        this.setState({battleMap: battleMap}, () => {
        })
    }
    handleReset = (e) => {
        e.preventDefault();        
        this.setState({ 
            isLoading: true, 
            size: 10,
            battleMap: genBattleMapState() 
        }, 
        () => {this.setState({isLoading: false})
        })   
    }
    handleSubmit = (e) => {
        e.preventDefault();        
        this.setState({ isLoading: true });
        this.props.createGame(this.state)
            // .then((render) => {render(<Redirect to="/active-game/" />)})
            .finally(() => this.setState({isLoading: false})); 
    }

    render() {
        if (this.state.isLoading) {
            return spinner()
        }
        if (!this.props.auth.authToken) { 
            return <Redirect to="/login"/>;
        }
        // if (this.props.gameId) {
        //     return <Redirect to="/active-game"/>;
        // }
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} className="white">
                    <h5 className="grey-text text-darken-3">New Game</h5>
                    <div className="range-field">
                        <span>
                            <h6 className="grey-text text-darken-3">Size</h6>
                        </span>
                        <input type="range" id="size" max="15" min="10" value={this.state.size} onChange={this.handleSizeChange}/>
                    </div>
                    
                    <div className="input-field">
                        <input type="text" id="name" defaultValue="Name of the game"  />
                    </div>
                    <div className="row">
                        <div className="col s8 ">
                             <Map 
                                onClick={this.onClick}
                                size={this.state.size} 
                                battleMap={this.state.battleMap}
                            />
                            
                            <div className="input-field">
                                <button className="btn pink lighten-1 z-depth-20">Create</button>
                                {this.props.err}
                            </div> 
                            <div className="input-field">
                                <button type='button' className="btn red lighten-1 z-depth-10" onClick={this.handleReset}>Reset</button>
                            </div>
                            
                        </div>
                        
                        <div className="col s4 ">
                                <Legend 
                                    size={this.state.size}
                                    battleMap={this.state.battleMap}   
                                />
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
        fleet: state.games.fleet,
        turn: state.games.turn,
        size: state.games.size,
        gameId: state.games.gameId,
        err: state.games.err
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createGame: (data) => dispatch(createGame(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame)