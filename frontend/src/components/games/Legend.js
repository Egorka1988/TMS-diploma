import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Cell } from './BattleMap'


class Legend extends Component {

    getShipCount = (shipType) => {
        const shipCount = this.props
            .fleetComposition[this.props.size][shipType]
        return <div>{shipCount}</div>
    }
    
    renderAircraftCarrier = () => {
        let body = []
        for (let i=0; i<6; i++) {
            body.push(<div key={'body'+i} className='aircraftbody'></div>)
        }
        const refit = [
            <div key='refit'>
                <div className='aircraftrefit'></div>
                <div className='aircraftrefit'></div>
            </div>
        ]
        return  <div key='aircraftCarrier' className='aircraftCarrier'>
                    {body}{refit}
                </div>
}
    
    renderShip = (deckCount) =>{
        let ship = []
        deckCount === 'air' ? ship.push(this.renderAircraftCarrier()) : null
        for (let i=0; i<deckCount; i++) {
            ship.push(
            <div key={'legendCell'+i+deckCount}>
                <Cell
                    cursor=''
                    color='lime'
                    disabled={this.props.disabled}
                    style={{border:'1px solid black', borderRadius: '2px', borderTop: 'none', height: 25, width: 25, backgroundColor: 'lime', borderTop: i === 0 ? '1px solid black': null}}
                />
            </div>)
        }
        return <div>{ship}</div>
    }
    
    renderLegend = () => {

        const fleetComposition = this.props.fleetComposition[this.props.size]
        const rows = [
                <div key='shipType'>Ship type</div>, 
                <div key='x'>X</div>, 
                <div key='count' >Count</div> 
        ]
        const ShipTypes = Object.keys(fleetComposition)

        for (let i = 0; i < ShipTypes.length; i++) {
            rows.push(
                <div key={'renderShip'+i}>
                    {this.renderShip(ShipTypes[i])}
                </div>)
            rows.push(
                <div key={'x'+i}>
                    X
                </div>)
            rows.push(
                <div key={'getShipCount'+i}>
                    {this.getShipCount(ShipTypes[i])}
                </div>)
        }
        return rows
    }

    render() {
        return (
            <div className="legendContainer">
                <div style={{gridArea: 'header1'}}>
                    <h6  className="grey-text text-darken-3">Your available ships for this field-size:</h6>
                </div>
                    {this.props.fleetComposition && this.renderLegend()}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        fleetComposition: state.auth.fleetComposition,
    }
}

export default connect(mapStateToProps)(Legend)
