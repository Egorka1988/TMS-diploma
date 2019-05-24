import React, {Component} from 'react'
import { connect } from 'react-redux'
import { spinner} from '../../utils';
import { Cell } from './BattleMap'

const ship = (size) => {
    let children = []
    let table = []
    for (let i=0; i<size; i++) {
        children.push(<div className='legend'></div>)
    }
    table.push(<div className="ship">{children}</div>)
    return table
}


export class Legend extends Component {

    state= {
        fleetComposition: {
            10: {'4': 1, '3': 2, '2': 3, '1': 4},
            11: {'4': 2, '3': 3, '2': 4, '1': 5},
            12: {'4': 2, '3': 4, '2': 5, '1': 6},
            13: {'4': 2, '3': 4, '2': 5, '1': 7, 'air': 1},
            14: {'4': 2, '3': 4, '2': 5, '1': 8, 'air': 2},
            15: {'4': 3, '3': 4, '2': 5, '1': 10, 'air': 3}
    }

    }
    
    getShipCount = (shipType) => {
        const shipCount = this.state
            .fleetComposition[this.props.size][shipType]
        return <div>{shipCount}</div>
    }
    renderAircraftCarrier = () => {
        let body = []
        for (let i=0; i<6; i++) {
            body.push(<div className='aircraftbody'></div>)
        }
        const refit = [
            <div>
                <div className='aircraftrefit'></div>
                <div className='aircraftrefit'></div>
            </div>
        ]
        return <div className='aircraftCarrier'>{body}{refit}</div>
}
    
    renderShip = (deckCount) =>{
        let ship = []
        deckCount === 'air' ? ship.push(this.renderAircraftCarrier()) : null
        for (let i=0; i<deckCount; i++) {
            ship.push(
            <div  >
                <Cell 
                size={this.props.size} 
                cursor=''
                color='lime'
                style={{border:'1px solid black', borderRadius: '5px', borderTop: 'none', height: 25, width: 25, backgroundColor: 'lime'}}
                />
            </div>)
        }
        return <div>{ship}</div>
    }
    renderLegend = () => {
        
        const rows = [
                <div>Ship</div>, 
                <div>X</div>, 
                <div>Count</div> 
        ]
        const ShipTypes = Object.keys(this.state
            .fleetComposition[this.props.size])

        for (let i = 0; i < ShipTypes.length; i++) {
            rows.push(<div>{this.renderShip(ShipTypes[i])}</div>)
            rows.push(<div>X</div>)
            rows.push(<div>{this.getShipCount(ShipTypes[i])}</div>)
        }
        return rows
    }

    render() {

        return (
            <div className="legendContainer">
                <div style={{gridArea: 'header1'}}>
                    <h6  className="grey-text text-darken-3">Your available ships for this field-size:</h6>
                </div>
                    {this.renderLegend()}
            </div>
        )
    }
}
