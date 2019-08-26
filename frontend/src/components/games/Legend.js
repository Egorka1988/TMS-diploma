import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Cell } from "./BattleMap";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";

const QUERY_FLEET_COMPOSITION = gql`
  {
    fleetComposition
  }
`;

export default function Legend(props) {
  const { data, loading, error } = useQuery(QUERY_FLEET_COMPOSITION);

  const getShipCount = (fleetComp, shipType) => {
    const shipCount = fleetComp[props.size][shipType];
    return <div>{shipCount}</div>;
  };
  const renderAircraftCarrier = () => {
    let body = [];
    for (let i = 0; i < 6; i++) {
      body.push(<div key={"body" + i} className="aircraftbody" />);
    }
    const refit = [
      <div key="refit">
        <div className="aircraftrefit" />
        <div className="aircraftrefit" />
      </div>
    ];
    return (
      <div key="aircraftCarrier" className="aircraftCarrier">
        {body}
        {refit}
      </div>
    );
  };

  const renderShip = deckCount => {
    let ship = [];
    deckCount === "air" ? ship.push(renderAircraftCarrier()) : null;
    for (let i = 0; i < deckCount; i++) {
      ship.push(
        <div key={"legendCell" + i + deckCount}>
          <Cell
            style={{
              border: "1px solid black",
              borderRadius: "2px",
              borderTop: "none",
              height: 25,
              width: 25,
              backgroundColor: "lime",
              borderTop: i === 0 ? "1px solid black" : null
            }}
            disabled
          />
        </div>
      );
    }
    return <div>{ship}</div>;
  };
  const renderLegend = fleetComp => {
    const currFleetComp = fleetComp[props.size];
    const rows = [
      <div key="shipType">Ship type</div>,
      <div key="x">X</div>,
      <div key="count">Count</div>
    ];
    const ShipTypes = Object.keys(currFleetComp);

    for (let i = 0; i < ShipTypes.length; i++) {
      rows.push(<div key={"renderShip" + i}>{renderShip(ShipTypes[i])}</div>);
      rows.push(<div key={"x" + i}>X</div>);
      rows.push(
        <div key={"getShipCount" + i}>{getShipCount(fleetComp, ShipTypes[i])}</div>
      );
    }
    return rows;
  };

  return (
    <div className="legendContainer">
      <div style={{ gridArea: "header1" }}>
        <h6 className="grey-text text-darken-3">
          Your available ships for this field-size:
        </h6>
      </div>
      {data &&
        data.fleetComposition &&
        renderLegend(JSON.parse(data.fleetComposition))}
      {loading ? <div>Loading...</div> : null}
    </div>
  );
}


// const mapStateToProps = state => {
//   return {
//     fleetComposition: state.games.fleetComposition
//   };
// };

// export default connect(mapStateToProps)(Legend);
