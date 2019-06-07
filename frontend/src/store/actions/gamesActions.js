
import { requestWrapper } from '../../utils'



export const getGames = () => {
    return async (dispatch, getState) => {
        
        const request = requestWrapper(
            getState,
            "GET",
            SERVICE_URL +'/rest/games/',   
        )

        const response = await fetch(request);
        const data = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'AVAILABLE_GAMES_LIST',
                availableGames: data,
            })
        } else {
            dispatch({
                type: 'AVAILABLE_GAMES_ERROR',
                err: data.detail
            })
        }
    }
}

export const createGame = (stateData) => {
    return async (dispatch, getState) => {
        let fleet = []
        const size = Object.keys(stateData.battleMap).length
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                stateData.battleMap[i+1][j+1].isSelected ? fleet.push([i+1,j+1]) : null
            }
        }
        const bodyData = {
            fleet, 
            size: stateData.size, 
            name: stateData.name,
        }
        const request = requestWrapper(
            getState,
            "POST",
            SERVICE_URL +'/rest/games/',  
            bodyData 
        )

        const response = await fetch(request);
        const respdata = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'GAME_CREATE_SUCCESS',
                gameId: respdata.id,
            })
        } else {
            dispatch({
                type: 'GAME_CREATE_ERROR',
                err: 'error',
                emptyFleet: respdata['fleet'],
                invalidShipType: respdata['not_allowed_ships'],
                invalidCount: respdata['not_allowed_ship_count'],
                invalidShipComposition: respdata['invalid_ship_composition'],
                forbiddenCells: respdata['forbidden_cells'],
            })
        }
    }
}


export const shoot = (cell, gameId) => {
    return async (dispatch, getState) => {
        
        const request = requestWrapper(
            getState,
            "PATCH",
            SERVICE_URL +'/rest/games/'+ gameId+ '/shoot/',  
            {shoot: cell} 
        )

        const response = await fetch(request);
        const respdata = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'SHOOT_RESULT_SUCCESS',
                state: respdata.state,
                shootResult: respdata.shoot,
                lastShoot: cell,
                enemyDeadZone: respdata.dead_zone,
                deadShip: respdata.dead_ship,
            })
        } else {
            dispatch({
                type: 'SHOOT_RESULT_ERROR',
                err: respdata.detail,
            })
        }
    }
}


export const loadActiveGame = (gameId, settingFleetMode=false) => {
    return async (dispatch, getState) => {
        
        const request = requestWrapper(
            getState,
            "GET",
            SERVICE_URL +'/rest/games/'+ gameId+ '/initial-state/',  
        )
        const response = await fetch(request);
        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: 'LOAD_ACTIVE_GAME',
                ...data,
                settingFleetMode: settingFleetMode
            })
        }
    }
}

export const joinGame = (game) => {
    return async (dispatch, getState) => {
        const request = requestWrapper(
            getState,
            "POST",
            SERVICE_URL +'/rest/games/' + game.id + '/join/',  
        )

        const response = await fetch(request);
        const respdata = await response;
        
        if (response.ok) {
            
            dispatch({
                type: 'JOIN_SUCCESS',
                size: game.size,
                name: game.name,
                creator: game.creator,
                gameId: game.id,
                joinErr: null,
            })
            return game.id
        } else {
            
            dispatch({
                type: 'JOIN_ERROR',
                joinErr: respdata.json(),
            })
        }
    }
}

export const joinFleet = (stateData, gameId) => {
    return async (dispatch, getState) => {
        let fleet = []
        const size = Object.keys(stateData.battleMap).length
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                stateData.battleMap[i+1][j+1].isSelected ? fleet.push([i+1,j+1]) : null
            }
        }
        const bodyData  ={
            fleet,
            size: stateData.size 
        }
        const request = requestWrapper(
            getState,
            "POST",
            SERVICE_URL +'/rest/games/' + gameId + '/join_fleet/',
            bodyData  
        )

        const response = await fetch(request);
        const respdata =  await response.json()
        
        if (response.ok) {
            dispatch({
                type: 'GAME_JOIN_FLEET_SUCCESS',
                isFleetJoined: true
            })
        } else {
            dispatch({
                type: 'GAME_JOIN_FLEET_ERROR',
                err: 'error',
                joinErr: respdata['err'],
                emptyFleet: respdata['fleet'],
                invalidShipType: respdata['not_allowed_ships'],
                invalidCount: respdata['not_allowed_ship_count'],
                invalidShipComposition: respdata['invalid_ship_composition'],
                forbiddenCells: respdata['forbidden_cells'],
            })
        }
    }
}

export const getGameState = (gameId) => {
    return async (dispatch, getState) => {
        const request = requestWrapper(
            getState,
            "GET",
            SERVICE_URL +'/rest/games/'+ gameId+ '/state/',  
        )
        const response = await fetch(request);
        const respdata = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'GAME_STATE',
                turn: respdata.turn,
                joiner: respdata.joiner,
                gameState: respdata.state,
                enemyShoots: respdata.shoots_of_enemy,
                myDeadZone: respdata.my_dead_zone,
            })
        }     
    }
} 

export const clickHandle = (cell, battleMap) => {
    return async (dispatch, getState) => {
        
        dispatch({
            type: 'FLEET_SET',
            cell: cell,
            battleMap: battleMap,
        })
    }
}