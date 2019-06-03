
export const signIn = (credentials) => {
    return async (dispatch, getState) => {
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        // token ? myHeaders.append("authorization", `Token ${token}`) : {}
        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify(credentials) };

        const myRequest = new Request('http://127.0.0.1:8000/rest/login/', myInit);
        const response = await fetch(myRequest);
        const data = await response.json();
        
      
        if (response.ok) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                token: data.token,
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

export const initialLoad = (currentUrl) => async (dispatch, getState) => {
    if (!getState().auth.authToken) return;
    const myHeaders = new Headers();
    let gameId = null
    let url = currentUrl.split('/');
    
        for (let i = 0; i< url.length; i++) {
            if (Number.isInteger(+url[i]) && (url[i+1] === 'join' || url[i+1] === 'active-game')) {
                gameId = url[i] 
                break
            }
        }

    myHeaders.append("authorization", `Token ${getState().auth.authToken}`)
        const myInit = { 
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                };
    const noGameUrl = 'http://127.0.0.1:8000/rest/initial-data/'
    const gameUrl = gameId ? noGameUrl+'?gameId='+ gameId : null
    const resp = await fetch(gameUrl ? gameUrl : noGameUrl, myInit);
    const data = await resp.json();

    const currentUser = data.username;
    if (data.isAuthenticated) {
        dispatch({
            'type': 'INITIAL_DATA', 
            currentUser: data.username,
            fleetComposition: data.fleet_composition    
        })
    } else {
        dispatch({'type': 'UNSET_CURRENT_USER', currentUser})
    }
}

export const editProfile = (editInfo) => {
    return async (dispatch, getState) => {
        
        
        const state = getState();
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        myHeaders.append("authorization", `Token ${state.authToken}`)
        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify(editInfo)
            };

        const myRequest = new Request('http://127.0.0.1:8000/rest/profile/', myInit);
        const response = await fetch(myRequest);
        const data = await response.json();

} 
}

export const signUp = (credentials) => {
    return async (dispatch, getState) => {
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify(credentials) };

        const myRequest = new Request('http://127.0.0.1:8000/rest/signup/', myInit);
        const response = await fetch(myRequest);
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