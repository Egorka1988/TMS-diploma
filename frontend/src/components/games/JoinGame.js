import React, {Component} from 'react'
import { joinFleet } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner} from '../../utils';
import { Map } from './BattleMap'
import Legend from './Legend'
import { genBattleMapState } from './NewGame'


class JoinGame extends Component {

    state = {
        name: this.props.name,
        size: this.props.size,
        isLoading: false,
        battleMap: genBattleMapState(this.props.size),
        errHandleCompleted: false
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
            size: this.props.size,
            battleMap: genBattleMapState(this.props.size), 
            errMsg: null
        }, 
        () => {this.setState({isLoading: false})
        })   
    }
    handleSubmit = (e) => {
        e.preventDefault();       
        this.setState({ isLoading: true });
        this.props.joinFleet(this.state, this.props.gameId)
            .finally(() => this.setState({isLoading: false, errHandleCompleted : false})); 
    }

    errorHandler = () => {
        const emptyFleet = this.props.emptyFleet
        const invalidShipType = this.props.invalidShipType
        const invalidCount = this.props.invalidCount
        const invalidShipComposition = this.props.invalidShipComposition
        const forbiddenCells = this.props.forbiddenCells
        let msg = []
        let battleMap = this.state.battleMap
        
        if (emptyFleet) {
            msg.push(<div key='joinEmptyFleet'>{emptyFleet}</div>)
        } 
        if (invalidCount) {
            msg.push(<div key='invalidJoinCount'>The ships' count is not correct. Check the schema. </div>)
        }
        if (invalidShipType) {
            for (const ship of invalidShipType) {
                msg.push(
                    <div key={'joinInvalidShipType'+ship}>
                        The ship on 
                        <font size="+1">
                            {ship[0][0]}{(ship[0][1] + 9).toString(36)}
                        </font>
                         is too big
                    </div>)
                for (const cell of ship) {
                    const [x, y] = cell;
                    battleMap[x][y] = {...battleMap[x][y], isError: true}
                }
            } 
        }
        
        if (invalidShipComposition) {
            for (const ship of invalidShipComposition) {
                msg.push(
                    <div key={'joinInvalidShipComposition'+ship}>
                        The ship on 
                        <font size="+1">
                            &nbsp; {ship[0][0]}{(ship[0][1] + 9).toString(36)} &nbsp;
                        </font>
                             is not properly built. Check the schema
                    </div>)
                for (const cell of ship) {
                    const [x, y] = cell;
                    battleMap[x][y] = {...battleMap[x][y], isError: true}
                }
            } 
        }
        if (forbiddenCells) {
            
            for (const cell of forbiddenCells) {
                const [x, y] = cell;
                battleMap[x][y] = {...battleMap[x][y], isError: true}
                msg.push(
                    <div key={'joinForbiddenCells' + cell}>
                        The ship on 
                        <font size="+1">
                            &nbsp; {x}{(y + 9).toString(36)} &nbsp;
                        </font>
                        is too close to other ship
                    </div>)
            } 
        }
        this.setState({
            errHandleCompleted: true,
            battleMap: battleMap,
            errMsg: msg
        })
    }

    render() {
        if (this.state.isLoading) {
            return spinner()
        }
        if (!this.props.auth.authToken) { 
            return <Redirect to="/login"/>;
        }
        if (this.props.deadZone) {

            return <Redirect to={'/'+ this.props.gameId +'/active-game'} />;
        }
        return (
            <div className="container">
                <div>
                    <h5 className="grey-text text-darken-3">Name of the game: {this.props.name}</h5>
                </div>
                <div className="input-field">
                    <h5 className="grey-text text-darken-3">Your opponent's name is {this.props.creator}</h5>
                </div>
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} className="white">
                    
                    <div className="row">
                        <div className="col s8 ">
                             <Map 
                                onClick={this.onClick}
                                size={this.props.size} 
                                battleMap={this.state.battleMap}
                            />
                            
                            <div className="input-field">
                                <button className="btn pink lighten-1 z-depth-20">Join</button>
                              
                                {this.props.err ? this.state.errHandleCompleted ? null : this.errorHandler() : null}
                                {this.state.errMsg}
                            </div> 
                            <div className="input-field">
                                <button type='button' className="btn red lighten-1 z-depth-10" onClick={this.handleReset}>Reset</button>
                            </div>
                            
                        </div>
                        
                        <div className="col s4 ">
                               <Legend 
                                    size={this.props.size}
                                    battleMap={this.state.battleMap}  
                                    disabled={true}  
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
        size: state.games.size,
        name: state.games.name,
        creator: state.games.creator,
        fleetComposition: state.auth.fleetComposition,
        auth: state.auth,
        err: state.games.err,
        deadZone: state.games.deadZone,
        gameId: state.games.gameId,
        emptyFleet: state.games.emptyFleet,
        invalidShipType: state.games.invalidShipType,
        invalidCount: state.games.invalidCount,
        invalidShipComposition: state.games.invalidShipComposition,
        forbiddenCells: state.games.forbiddenCells
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        joinFleet: (data, gameId) => dispatch(joinFleet(data, gameId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame)