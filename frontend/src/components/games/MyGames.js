import React, {useReducer} from "react";

function reducer(state, action) {
  switch (action.type) {
    case "DELETE_GAME":
      console.log("player deleted pending game");

      return ({
        resOfDel: ''
      })
  }
}

const MyGames = ({ currUser, myGames }) => {
  const [state, dispatch] = useReducer(reducer)
  const resumeHandler = id => {
    return <Redirect to={"/active-game/" + id} />;
  };
  const deleteHandler = id => {
    dispatch({type: 'DELETE_GAME'})
  };
  const giveUpHandler = id => {
    console.log("player gave up");
  };
  return (
    <div className="highlight">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Size</th>
            <th>Creator</th>
            <th>Joiner</th>
            <th>Turn</th>
          </tr>
        </thead>
        <tbody>
          <tr>{!myGames ? <td>Your games' list is empty</td> : null}</tr>
          {myGames &&
            myGames.map(game => {
              return (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.name}</td>
                  <td>{game.size}</td>
                  <td>
                    {game.creator.username == currUser ? <div>You</div> : game.creator.username}
                  </td>
                  <td>
                    {game.joiner ? (
                      game.joiner.username
                    ) : (
                      <div style={{ color: "red" }}>Not came yet</div>
                    )}
                  </td>
                  <td>{game.turn.username}</td>

                  <td>
                    <button
                      renderas="button"
                      className="btn pink lighten-1 z-depth-5"
                      onClick={() => resumeHandler(game.id)}
                    >
                      <span>Continue</span>
                    </button>
                  </td>
                  <td>
                    {!game.joiner ? (
                      <button
                        renderas="button"
                        className="btn red lighten-1 z-depth-5"
                        onClick={() => deleteHandler(game.id)}
                      >
                        <span>Delete</span>
                      </button>
                    ) : (
                      <button
                        renderas="button"
                        className="btn blue lighten-1 z-depth-5"
                        onClick={() => giveUpHandler(game.id)}
                      >
                        <span>Give_up</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default MyGames;
