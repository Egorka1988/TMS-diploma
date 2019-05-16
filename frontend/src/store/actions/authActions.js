var token = null;


export const signIn = (credentials) => {
    return async (dispatch, getState) => {
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json")
        token ? myHeaders.append("authorization", `Token ${token}`) : {}
        
        const myInit = { 
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                cache: 'default',
                body: JSON.stringify(credentials) };

        const myRequest = new Request('http://127.0.0.1:8000/rest/login/', myInit);
        const resp = await fetch(myRequest);
        console.log(resp.json())
        resp.ok ? dispatch({
                    type: 'LOGIN_SUCCESS',
                    token: resp.json().data.token
        }): dispatch({
                    type: 'LOGIN_ERROR',
                    token
                });
    }
}