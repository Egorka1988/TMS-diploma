import { requestWrapper } from '../../utils'

export const signIn = (credentials) => {
    return async (dispatch, getState) => {

        const request = requestWrapper(
            getState,
            "POST",
            SERVICE_URL + '/rest/login/',  
            credentials
        )

        const response = await fetch(request);
        const data = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                token: data.access,
                refreshAuthToken: data.refresh,
            })
            dispatch(initialLoad())
        } else {
            dispatch({
                type: 'LOGIN_ERROR',
                authError: 'Login failed',
                token: null
            })
        }
        return data;
    }
}

export const signOut = () => ({'type': 'LOG_OUT_SUCCESS'});

export const initialLoad = () => async (dispatch, getState) => {
    if (!getState().auth.authToken) return;
    
    const request = requestWrapper(
        getState,
        "GET",
        SERVICE_URL + '/rest/initial-data/',  
    )
    
    const response = await fetch(request);
    const data = await response.json();

    if (data.isAuthenticated) {
        dispatch({
            'type': 'INITIAL_DATA', 
            currentUser: data.username,  
        })
        dispatch({
            'type': 'FLEET_COMPOSITION', 
            fleetComposition: data.fleetComposition    
        })
    } else {
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        const myInit = { 
            method: "POST",
            mode: 'cors',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify({refresh: localStorage.getItem('refreshAuthToken')}),
        };
        const request = new Request(SERVICE_URL + '/rest/login/refresh/', myInit)
        const response = await fetch(request);
        const data = await response.json();
        if (response.ok) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                token: data.access,
                refreshAuthToken: data.refresh,
            })
        }
    }
}

export const signUp = (credentials) => {
    return async (dispatch, getState) => {
        const request = requestWrapper(
            getState,
            "POST",
            SERVICE_URL +'/rest/signup/',  
            credentials
        )
        const response = await fetch(request);
        const data = await response.json();
        
        if (response.ok) {
            dispatch({
                type: 'SIGN_UP_SUCCESS',
                token: data.token,
                username: data.username
            })
            dispatch(initialLoad())
        } else {
            dispatch({
                type: 'SIGN_UP_ERROR',
                authError: data.username || data.password,
                token: null
            })
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
