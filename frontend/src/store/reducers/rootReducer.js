import authReducer from './authReducer'
import gamesReducer from './gamesReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    games: gamesReducer,
});

export default rootReducer