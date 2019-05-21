import React from 'react'
import { Link, renderas } from 'react-router-dom'


const AvailableGames = ({availableGames}) => {
    return (
        <div className="highlight">
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Creator</th>
                </tr>
                </thead>
                <tbody>
                    { availableGames && availableGames.map(game => {
                        return( <tr key={game.id}>
                                    <td>{game.id}</td>                                 
                                    <td>{game.name}</td>
                                    <td>{game.size}</td>
                                    <td>{game.creator}</td>
                                    <td>
                                        <Link to={ game.id + '/join/' }>
                                            <button renderas="button" className="btn pink lighten-1 z-depth-0">
                                                <span>Join</span>
                                            </button>
                                        </Link>
                                    </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
        </div>
    )
}

export default AvailableGames

