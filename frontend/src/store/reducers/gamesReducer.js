const initState = {
    err: null,
}

const gamesReducer = (state = initState, action) => {
    switch(action.type){

        case 'FLEET_COMPOSITION':
             
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
                deadZone: action.deadZone,
                name: action.name,
                battleMap: action.battleMap,
                gameState: action.gameState,
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
        case 'JOIN_SUCCESS':
                console.log('Join success')
            return {  
                ...state,      
                size: action.size,
                name: action.name,
                creator: action.creator,
                gameId: action.gameId,
                joinErr: action.joinErr,
            }
        case 'JOIN_ERROR':
                console.log('Join failed')
            return {
                ...state,
                joinErr: action.joinErr,
            }
        case 'GAME_JOIN_FLEET_SUCCESS':
            console.log('Join fleet success')
        return {  
            ...state,      
            isFleetJoined: action.isFleetJoined
        }
        case 'GAME_JOIN_FLEET_ERROR':
                console.log('Join fleet failed')
            return {
                ...state,
                err: 'error',
                emptyFleet: action.emptyFleet,
                invalidShipType: action.invalidShipType,
                invalidCount: action.invalidCount,
                invalidShipComposition: action.invalidShipComposition,
                forbiddenCells: action.forbiddenCells,
                joinErr: action.joinErr,
            }
        
        default:
            return state;

    }
}
 
export default gamesReducer;