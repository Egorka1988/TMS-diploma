import React from 'react'
import style from './styles.css'

export const localStoreTokenManager = store => {
    let currentToken = localStorage.getItem('authToken') || null;

    store.dispatch({type: 'SET_AUTH_TOKEN', authToken: currentToken});

    return () => {
        const newToken = store.getState().auth.authToken;
        
    
         if (newToken === null) {
            localStorage.removeItem('authToken');
        } else if (newToken !== currentToken) {
            localStorage.setItem('authToken', newToken);
        }
    
        currentToken = newToken;
    }
}

export const spinner = () => {
        return (
            <div className="SpinnerStyle">
                <div className="preloader-wrapper big active"  >
                <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
            </div>
)}
