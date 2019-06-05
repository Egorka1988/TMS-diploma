
export const getGames = () => {
    return async (dispatch, getState) => {
        const myHeaders = new Headers();
        
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)
        const myInit = { 
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default'
            };

        const myRequest = new Request('http://127.0.0.1:8000/rest/games/', myInit);
        const response = await fetch(myRequest);
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
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)
        let fleet = []
        const size = Object.keys(stateData.battleMap).length
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                stateData.battleMap[i+1][j+1].isSelected ? fleet.push([i+1,j+1]) : null
            }
        }

        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify({
                    fleet, 
                    size: stateData.size, 
                    name: stateData.name,
                    })
                };

        const myRequest = new Request('http://127.0.0.1:8000/rest/games/', myInit);
        const response = await fetch(myRequest);
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
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)        
        const myInit = { 
                method: 'PATCH',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify({shoot: cell})
                };

        const url = 'http://127.0.0.1:8000/rest/games/'+ gameId+ '/shoot/'
        const myRequest = new Request(url, myInit);
        const response = await fetch(myRequest);
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
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)        
        const myInit = { 
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                };

        const url = 'http://127.0.0.1:8000/rest/games/'+ gameId+ '/initial-state/'
        const myRequest = new Request(url, myInit);
        const response = await fetch(myRequest);
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
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)        
        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                };

        const url = 'http://127.0.0.1:8000/rest/games/' + game.id + '/join/'
        const myRequest = new Request(url, myInit);
        const response = await fetch(myRequest);

        const respdata = await response;
        
        if (response.ok) {
            
            dispatch({
                type: 'JOIN_SUCCESS',
                size: game.size,
                name: game.name,
                creator: game.creator,
                gameId: game.id,
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
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)
        let fleet = []
        const size = Object.keys(stateData.battleMap).length
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                stateData.battleMap[i+1][j+1].isSelected ? fleet.push([i+1,j+1]) : null
            }
        }

        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify({
                    fleet,
                    size: stateData.size 
                    })
                };
        console.log(stateData)
        const myRequest = new Request('http://127.0.0.1:8000/rest/games/' + gameId + '/join_fleet/', myInit);
        const response = await fetch(myRequest);
        const respdata = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'GAME_JOIN_FLEET_SUCCESS',
                battleMap: stateData.battleMap,
                fleet: respdata.fleet,
                deadZone: respdata.dead_zone
            })
        } else {
            dispatch({
                type: 'GAME_JOIN_FLEET_ERROR',
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

export const getGameState = (gameId) => {
    return async (dispatch, getState) => {
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)        
        const myInit = { 
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default'
            }
               
        const url = 'http://127.0.0.1:8000/rest/games/'+ gameId+ '/state/'
        const myRequest = new Request(url, myInit);
        const response = await fetch(myRequest);
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