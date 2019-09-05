import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useQuery } from "react-apollo";
import { UltimatePagination } from "../dashboard/Pagination";
import { handleRecievedGamesList } from "../../store/actions/gamesActions";
import { QUERY_GET_ALL_MY_GAMES } from "../../graphQL/dashboard/queries";

const MyGames = props => {
  const { myGamesTotal, myGames, myGamesPerPage, currUser } = props;
  const [cursor, setCursor] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const myGamesPagesTotal = Math.ceil(myGamesTotal / myGamesPerPage);
  const { data, loading, error, refetch } = useQuery(QUERY_GET_ALL_MY_GAMES, {
    variables: {
      allMyGamesAfter: cursor,
      allMyGamesFirst: myGamesPerPage,
    }
  });
  const resumeHandler = id => {
    return <Redirect to={"/active-game/" + id} />;
  };
  const deleteHandler = id => {
    console.log("player deleted game");
  };
  const giveUpHandler = id => {
    console.log("player gave up");
  };
  const handlePageChange = page => {
    setCurrPage(page);
    const encodedCur = btoa("arrayconnection:" + ((page - 1) * myGamesPerPage - 1))
    //for making proper query on each page regardless both direction and step of move
    setCursor(encodedCur);
    refetch();
  };
  useEffect(() => {
    if (!error && data) {
      handleRecievedGamesList(data);
    }
  }, [data]);

  if (loading) {
    return <p>loading...</p>;
  }
  return (
    <div className="highlight">
      <UltimatePagination
        currentPage={currPage}
        totalPages={myGamesPagesTotal ? myGamesPagesTotal : 1}
        onChange={handlePageChange}
      />
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
          <tr>
            {!myGames ||
              (!myGames.length && (
                <td colSpan="4">Your games' list is empty</td>
              ))}
          </tr>
          {myGames &&
            myGames.map(game => {
              return (
                <tr key={game.node.gameId}>
                  <td>{game.node.gameId}</td>
                  <td>{game.node.name}</td>
                  <td>{game.node.size}</td>
                  <td>
                    {game.node.creator.username == currUser ? (
                      <div>You</div>
                    ) : (
                      game.node.creator.username
                    )}
                  </td>
                  <td>
                    {game.node.joiner ? (
                      game.node.joiner.username
                    ) : (
                      <div style={{ color: "red" }}>Not came yet</div>
                    )}
                  </td>
                  <td>{game.node.turn.username}</td>

                  <td>
                    <button
                      renderas="button"
                      className="btn pink lighten-1 z-depth-5"
                      onClick={() => resumeHandler(game.node.gameId)}
                    >
                      <span>Continue</span>
                    </button>
                  </td>
                  <td>
                    {!game.node.joiner ? (
                      <button
                        renderas="button"
                        className="btn red lighten-1 z-depth-5"
                        onClick={() => deleteHandler(game.node.gameId)}
                      >
                        <span>Delete</span>
                      </button>
                    ) : (
                      <button
                        renderas="button"
                        className="btn blue lighten-1 z-depth-5"
                        onClick={() => giveUpHandler(game.node.gameId)}
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
const mapStateToProps = state => {
  return {
    currUser: state.auth.curUser,
    myGames: state.games.allMyGames,
    myGamesTotal: state.games.allMyGamesTotal
  };
};

export default connect(mapStateToProps)(MyGames);
