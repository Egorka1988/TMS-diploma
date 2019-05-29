const initState = {
    err: null,
}

const gamesReducer = (state = initState, action) => {
    switch(action.type){
        case 'FLEET_COMPOSITION':
                console.log(action.fleetComposition)
            return {
                ...state, 
                fleetComposition: action.fleetComposition
            }
        case 'FLEET_COMPOSITION_ERROR':
                console.log(action.err)
            return {
                ...state,
                err: action.err,
            }
        case 'AVAILABLE_GAMES_LIST':
                console.log('Load games completed')
            return {
                ...state, 
                availableGames: action.availableGames
            }
        case 'AVAILABLE_GAMES_ERROR':
                console.log('Load games failed')
            return {
                ...state,
                err: action.err,
            }
        case 'GAME_CREATE_SUCCESS':
                console.log('Game created')
            return {
                ...state,
                fleet: action.fleet,
                turn: action.turn,
                size: action.size,
                gameId: action.gameId,
                err: null
            }
        case 'GAME_CREATE_ERROR':
                console.log('Create game failed')

            return {
                ...state,
                err: 'error',
                emptyFleet: action.emptyFleet,
                invalidShipType: action.invalidShipType,
                invalidCount: action.invalidCount,
                invalidShipComposition: action.invalidShipComposition,
                forbiddenCells: action.forbiddenCells,
            }
        default:
            return state;
    }
}
 
export default gamesReducer;