import React from "react";

export const errorHandler = (fleetErr, battleMap) => {
  const emptyFleet = fleetErr.emptyFleet;
  const invalidShipType = fleetErr.notAllowedShips;
  const invalidCount = fleetErr.notAllowedShipCount;
  const invalidShipComposition = fleetErr.invalidShipComposition;
  const forbiddenCells = fleetErr.forbiddenCells;
  const extraError = fleetErr.errMsg;
  let msg = [];

  if (emptyFleet) {
    msg.push(<div key="emptyFleet">{emptyFleet}</div>);
  }
  if (invalidCount) {
    msg.push(<div>The ships' count is not correct. Check the schema. </div>);
  }
  if (invalidShipType) {
    for (const ship of invalidShipType) {
      msg.push(
        <div key={"invalidShipType" + ship}>
          The ship on
          <font size="+1">
            &nbsp; {ship[0][0]}
            {(ship[0][1] + 9).toString(36)} &nbsp;
          </font>
          is too big
        </div>
      );
      for (const cell of ship) {
        const [x, y] = cell;
        battleMap[x][y] = { ...battleMap[x][y], isError: true };
      }
    }
  }

  if (invalidShipComposition) {
    for (const ship of invalidShipComposition) {
      msg.push(
        <div key={"invalidShipComposition" + ship}>
          The ship on
          <font size="+1">
            &nbsp; {ship[0][0]}
            {(ship[0][1] + 9).toString(36)} &nbsp;
          </font>
          is not properly built. Check the schema
        </div>
      );
      for (const cell of ship) {
        const [x, y] = cell;
        battleMap[x][y] = { ...battleMap[x][y], isError: true };
      }
    }
  }
  if (forbiddenCells) {
    for (const cell of forbiddenCells) {
      const [x, y] = cell;
      battleMap[x][y] = { ...battleMap[x][y], isError: true };
      let allowPush = true;
      msg.forEach(el => {
        if (el.key === "forbiddenCells" + cell) {
          allowPush = false;
        }
      });

      allowPush &&
        msg.push(
          <div key={"forbiddenCells" + cell}>
            The ship on
            <font size="+1">
              &nbsp; {x}
              {(y + 9).toString(36)} &nbsp;
            </font>
            is too close to other ship
          </div>
        );
    }
  }
  if (extraError) {
    msg.push(
      <div key={"extraError" + Date.now()}>{extraError}</div>
    )
  }
  return {
    errHandleCompleted: true,
    battleMap: battleMap,
    errMsg: msg
  };
};
