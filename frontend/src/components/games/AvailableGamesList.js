import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { connect } from "react-redux";
import { UltimatePagination } from "../dashboard/Pagination";
import { QUERY_GET_AVAILABLE_GAMES } from "../../graphQL/dashboard/queries";
import { handleRecievedGamesList } from "../../store/actions/gamesActions";
import { toast } from "react-toastify";

const AvailableGames = props => {
  const { avGamesTotal, avGames, avGamesPerPage, joinHandler } = props;
  const avGamesPagesTotal = Math.ceil(avGamesTotal / avGamesPerPage);
  const [cursor, setCursor] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const { data, loading, error, refetch } = useQuery(
    QUERY_GET_AVAILABLE_GAMES,
    {
      variables: {
        avGamesAfter: cursor,
        avGamesFirst: avGamesPerPage
      }
    }
  );
  useEffect(() => {
    if (!error && data) {
      handleRecievedGamesList(data);
    }
  }, [data]);

  const handlePageChange = page => {
    setCurrPage(page);
    const encodedCur = btoa(
      "arrayconnection:" + ((page - 1) * avGamesPerPage - 1)
    );
    //for making proper query on each page regardless both direction and step of move
    setCursor(encodedCur);
    refetch();
  };

  useEffect(() => {
    if (props.joinErr) {
      toast.configure({
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      toast.error(props.joinErr);
      refetch()
    }
  }, [props.joinErr]);

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div className="highlight">
      <UltimatePagination
        currentPage={currPage}
        totalPages={avGamesPagesTotal ? avGamesPagesTotal : 1}
        onChange={handlePageChange}
      />
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
          <tr>
            {!avGames ||
              (!avGames.length && (
                <td>No available games yet. Try to create your own</td>
              ))}
          </tr>
          {avGames &&
            avGames.map(game => {
              return (
                <tr key={game.node.gameId}>
                  <td>{game.node.gameId}</td>
                  <td>{game.node.name}</td>
                  <td>{game.node.size}</td>
                  <td>{game.node.creator.username}</td>
                  <td>
                    <button
                      renderas="button"
                      className="btn pink lighten-1 z-depth-5"
                      onClick={() => joinHandler(game.node)}
                    >
                      <span>Join</span>
                    </button>
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
    avGames: state.games.avGames,
    avGamesTotal: state.games.avGamesTotal,
    joinErr: state.games.joinErr
  };
};

export default connect(mapStateToProps)(AvailableGames);
