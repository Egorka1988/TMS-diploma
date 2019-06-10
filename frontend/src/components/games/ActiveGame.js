import React, {Component} from 'react'
import { shoot, getGameState, loadActiveGame } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner } from '../../utils';
import { Map } from './BattleMap'
import { WAIT_FOR_ENEMY_SHOOT, WAIT_FOR_YOUR_SHOOT, WIN, LOOSE, LOOSE_DESCR, NOBODY, WAITING_FOR_ENEMY } from '../../constants'


class ActiveGame extends Component {

    constructor(props){
        super(props)
        this.state = {
            showMessage: true
        }
        this._stop = null
    }

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
            this.setState({showMessage: true})
        }        
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.shootMsg !== prevProps.shootMsg) {
            this._stop && clearTimeout(this._stop);
            this._stop = setTimeout(() => {
                this.setState({showMessage: false});
                this._stop = null;
            }, 2000);
            this.setState({showMessage: true})
        }
    }
 
    render() {
        if (this.props.isLoading) {
            return spinner()
        }
        let msg = '';
        const { gameState, auth, name, size, shootMsg, battleMap } = this.props
        const { creator, joiner, enemyBattleMap, canShoot, turn, err } = this.props
        if (this.props.gameState === 'win') {
            clearInterval(this.timer);
            msg = WIN
        }
        if (gameState === 'loose') {
            clearInterval(this.timer);
            msg = <div>{LOOSE}<div className='stateDescr'>{LOOSE_DESCR}</div></div>
        }
        if (gameState === 'waiting_for_joiner') {
            msg = WAITING_FOR_ENEMY
        }
        if (gameState === 'active') {
            msg = turn === auth.currentUser ? 
            WAIT_FOR_YOUR_SHOOT :
            WAIT_FOR_ENEMY_SHOOT  
        }
        if (!auth.authToken) { 
            return <Redirect to="/auth"/>;
        }

        return (
            <div className="activeGameContainer">
                <div className="header">{name}</div>
                <div className="userMapsContainer">
                    <div className="mapContainer">
                        <div className="userInfoContainer">{auth.currentUser}</div>
                        <Map 
                            onClick={this.onClickSelf}
                            size={size}
                            battleMap={battleMap}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <div className="stateMsg">{msg}</div> 
                        <div></div>
                        <div className="mapContainer">{this.state.showMessage ? shootMsg : null}</div>
                        <div></div>
                        <div className="errContainer">{err}</div>
                    </div>
                    
                    <div className="mapContainer">
                        <div className="userInfoContainer">
                            {creator == auth.currentUser ? joiner ?  joiner : NOBODY : creator}
                        </div>
                        <Map 
                            onClick={this.onClick}
                            size={size}
                            battleMap={enemyBattleMap} 
                            disabled={!canShoot}
                        /> 
                    </div>
                </div>
            </div>
        )
    }
}
    
    const mapStateToProps = (state) => {

        return {
            auth: state.auth,
            isLoading: state.activeGame.isLoading,
            
            gameState: state.activeGame.gameState,
            
            winner: state.activeGame.winner,
            creator: state.activeGame.creator,
            joiner: state.activeGame.joiner,
            
            gameId: state.activeGame.gameId,
            name: state.activeGame.name, 
            turn: state.activeGame.turn,
            size: state.activeGame.size,

            err: state.activeGame.err,
            shootMsg: state.activeGame.shootMsg,

            canShoot: state.activeGame.gameState === "active" ? state.auth.currentUser === state.activeGame.turn : false,

            battleMap: state.activeGame.battleMap,
            enemyBattleMap: state.activeGame.enemyBattleMap,
        }
    }
    
    const mapDispatchToProps = (dispatch) => {
        return {
            loadActiveGame: (gameId) => dispatch(loadActiveGame(gameId)),
            getGameState: (gameId) => dispatch(getGameState(gameId)),
            shoot: (targetCell, gameId) => dispatch(shoot(targetCell, gameId)),
        }
    }
    
    export default connect(mapStateToProps, mapDispatchToProps)(ActiveGame)