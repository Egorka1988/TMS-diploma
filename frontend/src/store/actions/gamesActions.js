
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

export const createGame = (stateData, fleet) => {
    return async (dispatch, getState) => {
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${getState().auth.authToken}`)
        stateData.fleet = fleet
        console.log('hhhhh', stateData)
        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify(stateData)
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
            dispatch({
                type: 'GAME_CREATE_ERROR',
                err: respdata.fleet || respdata.size || respdata.name
            })
        }
    }
}

