const initState = {
    authError: null
}

const authReducer = (state = initState, action) => {
    switch(action.type){
        case 'LOGIN_ERROR':
            console.log('login failed')
            return {
                ...state,
                authError: 'Login failed',
                token: action.token
            }
        case 'LOGIN_SUCCESS':
            console.log('login success', action.token);
            return {
                ...state,
                authError: null,
                token: action.token
            }
        default:
            return state;
    }
}

export default authReducer