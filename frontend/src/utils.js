import React from 'react'
import style from './styles.css'
let x;

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



// closure example
// const iterator = n => {
//     let i = -1;
//     return () => {
//         i += 1;
//         if (i > n) throw Error('end');
//         return i;
//     };
// }

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

export const table = (size, prefix) => {
    let table = []

    for (let i = 0; i < size; i++) {
      let children = []
      for (let j = 0; j < size; j++) {
        children.push(<td className='battlemap' id={[i,j]}></td>)
      }
      table.push(<tr>{children}</tr>)
    }
    return table
  }

 export const changeColor = (id) => {
    let element = document.getElementById(id);
    if (element.style.backgroundColor != "lime") {
        element.style.backgroundColor = "lime";
    } else {
        element.style.backgroundColor = null;
        }
}

export const collectFleet = (size) => {
    let fleet = []

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
          const color = document.getElementById([i,j]).getAttribute("style")
        if (color !== null) {
            fleet.push([i,j])
        }
      }
    }
    console.log(fleet)
    return fleet
  }