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
        default:
            return state;
    }
}
 
export default gamesReducer;