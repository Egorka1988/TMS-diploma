import React from 'react'
import style from './styles.css'
// import { dispatch } from 'react-redux'
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


export const collectFleet = (size, dispatch) => {
    let fleet = []

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
          const color = document.getElementById([i,j]).getAttribute("style")
        if (color) {
            fleet.push([i,j])
        }
      }
    }
    return fleet
  }

  const ship = (size) => {
      let children = []
      let table = []
      for (let i=0; i<size; i++) {
          children.push(<div className='legend'></div>)
      }
      table.push(<div className="ship">{children}</div>)
      return table
  }

  const aircraftCarrier = () => {
    let body = []
    for (let i=0; i<6; i++) {
        body.push(<div className='aircraftbody'></div>)
    }
    const refit = [
        <div>
            <div className='aircraftrefit'></div>
            <div className='aircraftrefit'></div>
        </div>
    ]
    return <div className='aircraftCarrier'> {body}{refit} </div>
}

  export const ships = (size) => {
      let table = []
      size = +size

    switch(size){
        case 10:
            table.push(
            <tbody>
                <tr> <td>{ship(4)}</td> <td>X</td> <td>1</td> </tr>
                <tr> <td>{ship(3)}</td> <td>X</td> <td>2</td> </tr>
                <tr> <td>{ship(2)}</td> <td>X</td> <td>3</td> </tr>
                <tr> <td>{ship(1)}</td> <td>X</td> <td>4</td> </tr>
            </tbody>)
            return table
                      
        case 11:
            table.push(
                <tbody>
                    <tr> <td>{ship(4)}</td> <td>X</td> <td>2</td> </tr>
                    <tr> <td>{ship(3)}</td> <td>X</td> <td>2</td> </tr>
                    <tr> <td>{ship(2)}</td> <td>X</td> <td>3</td> </tr>
                    <tr> <td>{ship(1)}</td> <td>X</td> <td>6</td> </tr>
                </tbody>)
                return table
        case 12:
            table.push(
                <tbody>
                    <tr> <td>{aircraftCarrier()}</td> <td>X</td> <td>1</td> </tr>
                    <tr> <td>{ship(4)}</td> <td>X</td> <td>2</td> </tr>
                    <tr> <td>{ship(3)}</td> <td>X</td> <td>3</td> </tr>
                    <tr> <td>{ship(2)}</td> <td>X</td> <td>5</td> </tr>
                    <tr> <td>{ship(1)}</td> <td>X</td> <td>8</td> </tr>
                </tbody>)
            return table
        case 13:
            table.push(
                <tbody>
                    <tr> <td>{aircraftCarrier()}</td> <td>X</td> <td>2</td> </tr>
                    <tr> <td>{ship(4)}</td> <td>X</td> <td>3</td> </tr>
                    <tr> <td>{ship(3)}</td> <td>X</td> <td>4</td> </tr>
                    <tr> <td>{ship(2)}</td> <td>X</td> <td>5</td> </tr>
                    <tr> <td>{ship(1)}</td> <td>X</td> <td>10</td> </tr>
                </tbody>)
            return table
        case 14: 
            table.push(
                <tbody>
                    <tr> <td>{aircraftCarrier()}</td> <td>X</td> <td>2</td> </tr>
                    <tr> <td>{ship(4)}</td> <td>X</td> <td>4</td> </tr>
                    <tr> <td>{ship(3)}</td> <td>X</td> <td>5</td> </tr>
                    <tr> <td>{ship(2)}</td> <td>X</td> <td>8</td> </tr>
                    <tr> <td>{ship(1)}</td> <td>X</td> <td>12</td> </tr>
                </tbody>)
            return table
        case 15: 
            table.push(
                <tbody>
                    <tr> <td>{aircraftCarrier()}</td> <td>X</td> <td>3</td> </tr>
                    <tr> <td>{ship(4)}</td> <td>X</td> <td>4</td> </tr>
                    <tr> <td>{ship(3)}</td> <td>X</td> <td>8</td> </tr>
                    <tr> <td>{ship(2)}</td> <td>X</td> <td>8</td> </tr>
                    <tr> <td>{ship(1)}</td> <td>X</td> <td>15</td> </tr>
                </tbody>)
            return table
        default: 
                return table
        }
  }