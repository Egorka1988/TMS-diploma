import React, {Component} from 'react'
import { shoot, getGameState, loadActiveGame } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner, changeColor, collectFleet } from '../../utils';
import { Map } from './BattleMap'
import { genBattleMapState } from './NewGame'


class ActiveGame extends Component {
    componentWillMount(){
        this.props.loadActiveGame(this.props.match.params.gameId)
    }
    
    componentDidMount() {
        this.timer = setInterval(() =>{
            this.props.getGameState(this.props.match.params.gameId)
        }, 3000)
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    onClickSelf = () => {}
    
    onClick = (cell) => { 
        this.props.shoot(cell, this.props.gameId)
    }
 
    render() {
        console.log('state', this.state)
        console.log('props',this.props)
        if (this.props.isLoading) {
            return spinner()
        }
        let msg = '';
        if (this.props.gameState === 'win') {
            msg = <div>You win! <p>Congratulations!</p></div> 
        }
        if (this.props.gameState === 'loose') {
            msg = <div>You loose, bro. <p>Maybe next time you will be more lucky</p></div>
        }
        if (this.props.gameState === 'waiting_for_joiner') {
            msg = "Waiting for your opponent..."
        }
        if (this.props.gameState === 'active') {
            msg = "Let's go! Now shoots " + this.props.turn
        }
        if (!this.props.auth.authToken) { 
            return <Redirect to="/login"/>;
        }
        
        return (
            <div className="activeGameContainer">
                <div className="header">{this.props.name}</div>
                <div className="userInfoContainer">
                    <div>{this.props.auth.currentUser}</div>
                    <div>{this.props.creator == this.props.auth.currentUser ? this.props.joiner ?  this.props.joiner : <span>Nobody yet...</span> : this.props.creator}</div>
                </div>
                <div className="userMapsContainer">
                    <div>
                        <Map 
                            onClick={this.onClickSelf}
                            size={this.props.size}
                            battleMap={this.props.battleMap}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <div>{msg}</div> 
                        <div>{this.props.shootMsg}</div>
                        <div>{this.props.err}</div>
                    </div>
                    
                    <div>
                        <Map 
                            onClick={this.onClick}
                            size={this.props.size}
                            battleMap={this.props.enemyBattleMap} 
                            disabled={this.props.isDisabled}
                        /> 
                    </div>
                </div>
            </div>
        )
    }
}
    
    const mapStateToProps = (state) => {
        
        return {
            isLoading: state.activeGame.isLoading,
            gameState: state.activeGame.gameState,
            creator: state.activeGame.creator,
            joiner: state.activeGame.joiner,
            gameId: state.activeGame.gameId,
            fleet: state.activeGame.fleet,
            name: state.activeGame.name, 
            turn: state.activeGame.turn,
            size: state.activeGame.size,

            auth: state.auth,
            err: state.activeGame.err,
            shootMsg: state.shootMsg,

            isDisabled: state.activeGame.turn == state.auth.currentUser,

            battleMap: state.activeGame.battleMap,
            enemyBattleMap: state.activeGame.enemyBattleMap,
            
            winner: state.activeGame.winner,
        }
    }
    
    const mapDispatchToProps = (dispatch) => {
        return {
            loadActiveGame: (gameId) => dispatch(loadActiveGame(gameId)),
            getGameState: (gameId, gameState) => dispatch(getGameState(gameId, gameState)),
            shoot: (targetCell, gameId) => dispatch(shoot(targetCell, gameId)),
            
        }
    }
    
    export default connect(mapStateToProps, mapDispatchToProps)(ActiveGame)