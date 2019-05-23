const initState = {
    err: null,
}

const gamesReducer = (state = initState, action) => {
    switch(action.type){
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
                err: action.err,
            }
        default:
            return state;
    }
}
 
export default gamesReducer;