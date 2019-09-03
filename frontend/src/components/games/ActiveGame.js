import React from "react";
import { useState, useEffect, useMemo } from "react";
import { shoot, updateGame, serveData } from "../../store/actions/gamesActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { spinner } from "../../utils";
import { Map } from "./BattleMap";
import {
  WAIT_FOR_ENEMY_SHOOT,
  WAIT_FOR_YOUR_SHOOT,
  WIN,
  LOOSE,
  LOOSE_DESCR,
  NOBODY,
  WAITING_FOR_ENEMY
} from "../../constants";
import { useQuery, useMutation } from "react-apollo";
import {
  QUERY_LOAD_ACTIVE_GAME,
  QUERY_GET_GAME_STATE,
  MUTATION_SHOOT
} from "../../gql";
import { client } from "../../index";

function ActiveGame(props) {
  const gameId = props.match.params.gameId;
  const [state, setState] = useState();
  const [showMessage, allowShowMsg] = useState(true);
  const loadActGam = useQuery(QUERY_LOAD_ACTIVE_GAME, {
    variables: { gameId }
  });
  const { gameState, auth, name, size, shootMsg, battleMap } = props;

  const [msg, setMsg] = useState("");
  const { creator, joiner, enemyBattleMap, canShoot, turn, err } = props;
  const enemy = auth.currUser == creator ? joiner : creator;

  if (!auth.authToken) {
    return <Redirect to="/auth" />;
  }
  const timer = useMemo(
    () =>
      setInterval(() => {
        //polling for fetching fresh game state.
        client
          .query({
            query: QUERY_GET_GAME_STATE,
            variables: { gameId },
            fetchPolicy: "no-cache"
          })
          .then(data => {
            props.updateGame(data.data.gameStateData);
          });
        console.log("tick");
      }, 3000),
    [gameId]
  );
  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    loadActGam.data && props.serveData(loadActGam.data);
  }, [loadActGam.data.activeGame]);

  useEffect(() => {
    let clearTimeoutMsg = null;
    if (shootMsg) {
      clearTimeoutMsg = setTimeout(() => allowShowMsg(false), 2000);
    }
    return () => {
      clearTimeoutMsg &&
        clearTimeout(clearTimeoutMsg) &&
        console.log("skip timeout of shootmsg");
    };
  }, [shootMsg]);


  useEffect(() => {
    switch (gameState) {
      case "win":
        setMsg(WIN);
        clearInterval(timer);
        console.log("win");
        break;
      case "loose":
        setMsg(
          <div>
            {LOOSE}
            <div className="stateDescr">{LOOSE_DESCR}</div>
          </div>
        );
        clearInterval(timer);
        console.log("loose");
        break;
      case "waiting_for_joiner":
        setMsg(WAITING_FOR_ENEMY);
        break;
      case "active":
        setMsg(
          turn === auth.currUser ? WAIT_FOR_YOUR_SHOOT : WAIT_FOR_ENEMY_SHOOT
        );
        break;
      default:
        setMsg("");
    }
  }, [turn, gameState]);

  const onClick = cell => {
    if (canShoot) {
      client
        .mutate({
          mutation: MUTATION_SHOOT,
          variables: {
            gameId,
            shoot: cell
          }
        })
        .then(resp => {
          if (resp.data) {
            props.shoot(resp.data.shoot, cell);
            allowShowMsg(true);
          }
        });
    }
  };

  if (props.isLoading) {
    return spinner();
  }
  console.log("render");
  return (
    <div className="activeGameContainer">
      <div className="header">{name}</div>
      <div className="userMapsContainer">
        <div className="mapContainer">
          <div className="userInfoContainer">{auth.currUser}</div>
            <Map
              onClick={null}
              size={size}
              battleMap={battleMap}
              disabled={true}
            />
        </div>
        <div>
          <div className="stateMsg">{msg}</div>
          <div className="mapContainer">{showMessage ? shootMsg : null}</div>
          <div />
          <div className="errContainer">{err}</div>
        </div>

        <div className="mapContainer">
          <div className="userInfoContainer">{enemy ? enemy : NOBODY}</div>
            <Map
              onClick={onClick}
              size={size}
              battleMap={enemyBattleMap}
              disabled={!canShoot}
            />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    isLoading: state.activeGame.isLoading,

    gameState: state.activeGame.gameState,

    winner: state.activeGame.winner,
    creator: state.activeGame.creator,
    joiner: state.activeGame.joiner,

    name: state.activeGame.name,
    turn: state.activeGame.turn,
    size: state.activeGame.size,

    shootError: state.activeGame.shootError,
    shootMsg: state.activeGame.shootMsg,

    canShoot:
      state.activeGame.gameState === "active"
        ? state.auth.currUser === state.activeGame.turn
        : false,

    battleMap: state.activeGame.battleMap,
    enemyBattleMap: state.activeGame.enemyBattleMap
  };
};

const mapDispatchToProps = dispatch => {
  return {
    serveData: data => dispatch(serveData(data)),
    updateGame: data => dispatch(updateGame(data)),
    shoot: (targetCell, gameId) => dispatch(shoot(targetCell, gameId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveGame);
