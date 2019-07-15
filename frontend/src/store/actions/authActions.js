import { requestWrapper } from '../../utils'
import { fetch } from './refreshTokenAction'

export const signIn = (credentials) => {
    return async (dispatch, getState) => {
        dispatch({
            type: 'LOGIN_ERROR',
            authError: null
        })

        const request = requestWrapper(
            "POST",
            SERVICE_URL + '/rest/login/',  
            credentials
        )
        const response = await fetch(request)
        .catch(function (error){
            return error;
        })
        const data = await response.body;
        if (response.response.ok) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                token: data.access,
                refreshAuthToken: data.refresh,
            })
            dispatch(initialLoad())
        } else {
            dispatch({
                type: 'LOGIN_ERROR',
                authError: "Login failed"
            })
            // setTimeout(() => dispatch({
            //     type: 'LOGIN_ERROR',
            //     authError: null
            // }), 2000)
        }
        return data;
    }
}


export const signOut = () => {
    return async (dispatch, getState) => {
        const request = requestWrapper(
            "POST",
            SERVICE_URL +'/rest/logout/',  
            {refresh: localStorage.getItem('refreshAuthToken')} 
        )
        const response = await fetch(request)
            .catch(
                error => {
                    dispatch({
                        type: 'LOG_OUT_ERROR',
                        authError: error.body,
                    })
                }
            )
        const data = await response.body;

        if (response.response.ok) {
            dispatch({
                type: 'LOG_OUT_SUCCESS'      
            })
        }
    }
}


export const initialLoad = () => async (dispatch, getState) => {
    if (!getState().auth.authToken) return;
    
    const response = await fetch(SERVICE_URL + '/rest/initial-data/', {method: "GET"});
    const data = await response.body;

    if (data.isAuthenticated) {
        dispatch({
            'type': 'INITIAL_DATA', 
            currentUser: data.username,  
        })
        dispatch({
            'type': 'FLEET_COMPOSITION', 
            fleetComposition: data.fleetComposition    
        })
    }
}

export const signUp = (credentials) => {
    return async (dispatch, getState) => {
        dispatch({
            type: 'LOGIN_ERROR',
            authError: null
        })

        const request = requestWrapper(
            "POST",
            SERVICE_URL +'/rest/signup/',  
            credentials
        )
        const response = await fetch(request)
            .catch(
                error => {
                    dispatch({
                        type: 'SIGN_UP_ERROR',
                        authError: error.body.username || error.body.password,
                        token: null
                    })
                }
            )
        const data = await response.body;
        if (response.response.ok) {
            dispatch({
                type: 'SIGN_UP_SUCCESS',
                authToken: data.access,
                refreshAuthToken: data.refresh,
                username: data.username
            })
            dispatch(initialLoad())
        }
    }
}

export const signData = (act) => {

    return async (dispatch, getState) => {
        if (act === "signUp") {

            dispatch({
                type: 'RENDER_SIGN_UP_DATA',
            })
        }
        if (act === "signIn") {
            dispatch({
                type: 'RENDER_SIGN_IN_DATA',
            })
        }
    }
}
