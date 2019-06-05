import authReducer from './authReducer'
import gamesReducer from './gamesReducer'
import activeGameReducer from './activeGameReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    games: gamesReducer,
    activeGame: activeGameReducer,
});

export default rootReducer