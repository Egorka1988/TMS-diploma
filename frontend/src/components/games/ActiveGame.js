import React, {Component} from 'react'
import { shoot, getGameState, loadActiveGame } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner } from '../../utils';
import { Map } from './BattleMap'


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
        if (this.props.canShoot) {
            this.props.shoot(cell, this.props.gameId);
        }        
    }
 
    render() {
        console.log('props',this.props)
        if (this.props.isLoading) {
            return spinner()
        }
        let msg = '';
        if (this.props.gameState === 'win') {
            clearInterval(this.timer);
            msg = <div ><div>You win!</div><div>Congratulations!</div></div>
        }
        if (this.props.gameState === 'loose') {
            clearInterval(this.timer);
            msg =<div><div>You loose, bro.</div><div className='stateDescr'>Maybe next time you will be more lucky</div></div>
        }
        if (this.props.gameState === 'waiting_for_joiner') {

            msg = <div >Waiting for your opponent...</div>
        }
        if (this.props.gameState === 'active') {
            msg = this.props.turn === this.props.auth.currentUser ? 
            <div>Ok, bro, shoot!</div> :
            <div>Wait for your enemy's shoot...</div>
        }
        if (!this.props.auth.authToken) { 
            return <Redirect to="/login"/>;
        }

        return (
            <div className="activeGameContainer">
                <div className="header">{this.props.name}</div>
                <div className="userMapsContainer">
                    <div className="mapContainer">
                        <div className="userInfoContainer">{this.props.auth.currentUser}</div>
                        <Map 
                            onClick={this.onClickSelf}
                            size={this.props.size}
                            battleMap={this.props.battleMap}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <div className="stateMsg">{msg}</div> 
                        <div></div>
                        <div className="mapContainer">{this.props.shootMsg}</div>
                        <div></div>
                        <div className="errContainer">{this.props.err}</div>
                    </div>
                    
                    <div className="mapContainer">
                        <div className="userInfoContainer">{this.props.creator == this.props.auth.currentUser ? this.props.joiner ?  this.props.joiner : <span>Nobody yet...</span> : this.props.creator}</div>
                        <Map 
                            onClick={this.onClick}
                            size={this.props.size}
                            battleMap={this.props.enemyBattleMap} 
                            disabled={!this.props.canShoot}
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
            shootMsg: state.activeGame.shootMsg,

            isDisabled: state.activeGame.isDisabled,

            battleMap: state.activeGame.battleMap,
            enemyBattleMap: state.activeGame.enemyBattleMap,
            
            winner: state.activeGame.winner,

            canShoot: state.activeGame.gameState === "active" ? state.auth.currentUser === state.activeGame.turn : false,
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