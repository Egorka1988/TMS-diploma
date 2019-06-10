

const initState = {
    authError: null,
}

const authReducer = (state = initState, action) => {

    switch(action.type){
        case 'SET_AUTH_TOKEN':
            return {...state, authToken: action.authToken};
        case 'LOGIN_ERROR':
            console.log('login failed')
            return {
                ...state,
                authError: 'Login failed',
                authToken: null,
                currentUser: null,
            }
        case 'LOGIN_SUCCESS':
            console.log('login success');
            return {
                ...state,
                authError: null,
                authToken: action.token,
                currentUser: action.currentUser 
            }
        case 'LOG_OUT_SUCCESS':
            console.log('user logged out')
            return {
                ...state,
                authToken: null,
                currentUser: null,
            }

        case 'INITIAL_DATA': 
            return {
                ...state,
                currentUser: action.currentUser,
                fleetComposition: action.fleetComposition
            }
        case 'SIGN_UP_SUCCESS':
            console.log('sign up success');
            return {
                ...state,
                authError: null,
                authToken: action.token,
                username: action.username 
            }
        case 'SIGN_UP_ERROR':
            console.log('sign up failed');
            return {
                ...state,
                authError: action.authError,
                authToken: null,
                username: action.username 
            }
        case 'RENDER_SIGN_UP_DATA':
            return {
                ...state,
                isNewUser: true,
            }
        case 'RENDER_SIGN_IN_DATA':
            return {
                ...state,
                isNewUser: false,
                authError: null,
            }
        default:
            return state;
    }
}
 
export default authReducer;