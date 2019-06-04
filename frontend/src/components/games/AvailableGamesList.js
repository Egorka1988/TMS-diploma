import React from 'react'


const AvailableGames = ({availableGames, joinHandler, joinErr}) => {
    
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
                        return( 
                            <tr key={game.id}>
                                    <td>{game.id}</td>                                 
                                    <td>{game.name}</td>
                                    <td>{game.size}</td>
                                    <td>{game.creator}</td>
                                    <td>
                                        <button 
                                            renderas="button" 
                                            className="btn pink lighten-1 z-depth-0"
                                            onClick={() => joinHandler(game)} >
                                            <span>Join</span>
                                        </button>
                                    </td>
                                    <td>{joinErr}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>   
        </div>
    )
}

export default AvailableGames

