
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
                token: data.token
            })
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
