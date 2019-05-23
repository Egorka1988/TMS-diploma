import React, {Component} from 'react'
import { createGame } from '../../store/actions/gamesActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner, collectFleet, ships } from '../../utils';


const Cell = ({ index, isSelected, color, onClick}) => {

    return (
        <div 
            isSelected= {isSelected}
            onClick={() => onClick(index)} 
            style={{
                width: 25, 
                height: 25, 
                backgroundColor: `${color}`,
                cursor: 'pointer'
            }}
            >
            </div>
    );
}


const LegendCell = ({ children }) => {
    return (
        <div style={{
                textAlign: 'center',
                width: 25, 
                height: 25, 
                backgroundColor: '#ff80ab',
            }}>
            {children}
        </div>
    );
}


const BattleMap = ({ size,isSelected, color }) => {
    let bulk = []
    for (let i=0; i<size+1; i++) {
        for (let j=0; j<size+1; j++) {
            if (i == 0 && j == 0) {
                bulk.push(<LegendCell/>)
            } else if (i == 0) {
                bulk.push(<LegendCell>{(j + 9).toString(36)}</LegendCell>)
            } else if (j == 0) {
                bulk.push(<LegendCell>{i}</LegendCell>)
            } else {
                bulk.push(<Cell index={[i,j]} isSelected={isSelected} color={color}/>)
            }
        }
    }
    return <div style={{display: 'inline-block'}}>
                <div style={{
                        display: 'grid',
                        gridTemplate:
                            `repeat(${size+1}, 25px)
                            /repeat(${size+1}, 25px)`,
                        backgroundColor: 'black',
                        gridGap: '1px',
                        border: '1px solid black'
                    }}>
                    {bulk}
                </div>
            </div>
}


class NewGame extends Component {

    state = {
        name: '',
        size: 10,
        isLoading: false,
        isSelected: false,
        color: 'white',
        fleet: [{index:{isSelected:true, color: 'lime'}}],
    }

    
    handleSizeChange = (e) => {
        const size = parseInt(e.target.value);
        this.setState({size})
    }

    onClick = (index) => {
        const data = index.target.isSelected
        
        if (data) { 
            this.setState({
                fleet: fleet.index.isSelected = false,
                fleet: fleet.index.color = 'white'
            })
        } else {
            this.setState({
            fleet: fleet.index.isSelected = true,
            fleet: fleet.index.color = 'lime'})
        } 
    }
    handleSubmit = (e) => {
        e.preventDefault();        
        const fleet = collectFleet(this.state.size);
        this.setState({ isLoading: true });
        console.log(this.state);
        this.props.createGame(this.state, fleet)
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
        if (this.props.gameId) {

            return <Redirect to="/active-game"/>;
        }
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
                             <BattleMap 
                                onClick={this.onClick(e)}
                                size={this.state.size} 
                                isSelected={this.state.isSelected} 
                                color={this.state.color} 

                                // currentBattleMap={this.state.battleMap} 
                            />
                        </div>
                        <div className="col s4 ">
                            <h6 className="grey-text text-darken-3">Your available ships for this field-size:</h6>
                            <table id='legend' className='tableMap'>
                                <tbody>
                                    <tr>
                                        <td>Ship</td> 
                                        <td>X</td> 
                                        <td>Count</td> 
                                    </tr>
                                </tbody>
                                {ships(this.state.size)}
                            </table>
                        </div>
                    </div>
                    
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Create</button>
                        {this.props.err}
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
        createGame: (data, fleet) => dispatch(createGame(data,fleet))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame)