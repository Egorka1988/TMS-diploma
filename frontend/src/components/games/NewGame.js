import React, {Component} from 'react'
import { createGame } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner} from '../../utils';
import { Map } from './BattleMap'
import Legend from './Legend'


const genBattleMapState = (size=10) => {
   
    let battleMap = {}
    for (let i=1; i<size+1; i++) {
        battleMap[i] = {}
        for (let j=1; j<size+1; j++) {
            battleMap[i][j] = {isSelected: false}
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
        battleMap: genBattleMapState(),
        errHandleCompleted: false
    }

    
    handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        this.setState({size, battleMap : genBattleMapState(size), errMsg: null})
    }

    onClick = (cell) => { 
        if (this.state.errHandleCompleted) {
            let resetBattleMap = this.state.battleMap
            for (let i = 1; i<this.state.size+1; i++) {
                for (let j = 1; j<this.state.size+1;j++) {
                    resetBattleMap[i][j].isError = false
                }
            }
            this.setState({battleMap: resetBattleMap})            
        }
        const [x, y] = cell;
        let battleMap = this.state.battleMap
        
        let oldCell = battleMap[x][y]
        let newCell = {...oldCell, isSelected: !oldCell.isSelected}
        
        
        this.setState({battleMap: {
            ...battleMap,
            [x]: {...battleMap[x], [y]: newCell}
        }})
    }
    handleReset = (e) => {
        e.preventDefault();        
        this.setState({ 
            isLoading: true, 
            size: 10,
            battleMap: genBattleMapState(), 
            errMsg: null
        }, 
        () => {this.setState({isLoading: false})
        })   
    }
    handleSubmit = (e) => {
        e.preventDefault();       
        this.setState({ isLoading: true });
        this.props.createGame(this.state)
            // .then((render) => {render(<Redirect to="/active-game/" />)})
            .finally(() => this.setState({isLoading: false, errHandleCompleted : false})); 
    }

    errorHandler = () => {
        const emptyFleet = this.props.emptyFleet
        const invalidShipType = this.props.invalidShipType
        const invalidCount = this.props.invalidCount
        const invalidShipComposition = this.props.invalidShipComposition
        const forbiddenCells = this.props.forbiddenCells
        let msg = []
        if (emptyFleet) {
            return (<div>{emptyFleet}</div>)
        } 
        if (invalidShipType) {
            let battleMap = this.state.battleMap
            for (const ship of invalidShipType) {
                msg.push(<div>The ship on <font size="+1">{ship[0][0]}{(ship[0][1] + 9).toString(36)}</font> is too big</div>)
                for (const cell of ship) {
                const [x, y] = cell;
                battleMap[x][y] = {...battleMap[x][y], isError: true}
                }
            } 
            this.setState({
                errHandleCompleted: true,
                battleMap: battleMap,
                errMsg: msg
            })
        }
        if (invalidCount) {
            msg.push(<div>The ships' count is not correct. See the schema. </div>)
            this.setState({
                errMsg: msg,
                errHandleCompleted: true,
            })
        }
        if (invalidShipComposition) {
            let battleMap = this.state.battleMap
            for (const ship of invalidShipComposition) {
                msg.push(<div>The ship on <font size="+1">{ship[0][0]}{(ship[0][1] + 9).toString(36)}</font> is not properly built. Check the schema</div>)
                for (const cell of ship) {
                const [x, y] = cell;
                battleMap[x][y] = {...battleMap[x][y], isError: true}
                }
            } 
            this.setState({
                errHandleCompleted: true,
                battleMap: battleMap,
                errMsg: msg
            })
        }
        if (forbiddenCells) {
            let battleMap = this.state.battleMap
            for (const cell of forbiddenCells) {
                const [x, y] = cell;
                battleMap[x][y] = {...battleMap[x][y], isError: true}
                msg.push(<div>The ship on <font size="+1">{x}{(y + 9).toString(36)}</font> is too close to other ship</div>)
            } 
            this.setState({
                errHandleCompleted: true,
                battleMap: battleMap,
                errMsg: msg
            })
        }


        
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
                              
                                {this.props.err ? this.state.errHandleCompleted ? null : this.errorHandler() : null}
                                {this.state.errMsg}
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
        fleetComposition: state.auth.fleetComposition,
        auth: state.auth,
        fleet: state.games.fleet,
        turn: state.games.turn,
        size: state.games.size,
        gameId: state.games.gameId,
        err: state.games.err,
        emptyFleet: state.games.emptyFleet,
        invalidShipType: state.games.invalidShipType,
        invalidCount: state.games.invalidCount,
        invalidShipComposition: state.games.invalidShipComposition,
        forbiddenCells: state.games.forbiddenCells
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createGame: (data) => dispatch(createGame(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame)