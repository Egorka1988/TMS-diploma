
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
                    name: stateData.name
                    })
                };

        const myRequest = new Request('http://127.0.0.1:8000/rest/games/', myInit);
        const response = await fetch(myRequest);
        const respdata = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'GAME_CREATE_SUCCESS',
                fleet: respdata.fleet,
                turn: respdata.turn,
                size: respdata.size,
                gameId: respdata.id
            })
        } else {
            const data = respdata
            dispatch({
                type: 'GAME_CREATE_ERROR',
                err: 'error',
                emptyFleet: data['fleet'],
                invalidShipType: data['not_allowed_ships'],
                invalidCount: data['not_allowed_ship_count'],
                invalidShipComposition: data['invalid_ship_composition'],
                forbiddenCells: data['forbidden_cells'],
            })
        }
    }
}

