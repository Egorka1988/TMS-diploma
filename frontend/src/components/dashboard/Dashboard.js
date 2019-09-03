import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getGames,
  handleJoinGameResponse
} from "../../store/actions/gamesActions";
import AvailableGames from "../games/AvailableGamesList";
import MyGames from "../games/MyGames";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "react-apollo";
import { MUTATION_JOIN_GAME, QUERY_GET_GAMES } from "../../gql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard(props) {
  const { data, loading, error, refetch } = useQuery(QUERY_GET_GAMES);
  const [avGames, setAvGames] = useState(null);
  const [myGames, setMyGames] = useState(null);
  const [redirect, allowRedirect] = useState();
  const [joinGame, resp] = useMutation(MUTATION_JOIN_GAME);

  const deleteHandler = id => {
    console.log("player deleted pending game");
  };
  const giveUpHandler = id => {
    console.log("player gave up");
  };
  const joinHandler = game => {
    joinGame({
      variables: {
        gameId: game.id
      }
    }).then(resp => {
      if (resp.data.joinGame) {
        handleJoinGameResponse(resp.data.joinGame);
      }
    });
  };

  const resumeHandler = game => {
    resumeGame(game);
  };
  useEffect(() => {
    if (!error && data) {
      setAvGames(data.avGames);
      setMyGames(data.myGames);
    }
  }, [data]);

  useEffect(() => {
    if (props.gameId) {
      allowRedirect(true);
    }
  }, [props.gameId]);

  if (redirect) {
    return <Redirect to={"/join/" + props.gameId} />;
  }

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
      refetch();
    }
  }, [props.joinErr]);

  return (
    <div className="container">
      <div className="row">
        <div className="col s12 m6">
          <p />
          <Link to="/create/">
            <div className="btn-floating btn-large waves-effect waves-light red">
              <i className="material-icons">add</i>
            </div>
            <span> Create new game</span>
          </Link>
          {loading ? (
            <p>loading...</p>
          ) : (
            <AvailableGames
              availableGames={avGames && avGames.length ? avGames : null}
              joinHandler={joinHandler}
            />
          )}
        </div>
        <div className="col s12 m5 offset-m1">
          <p />
          <button className="btn-large  red">
            <span>Arhive games</span>
          </button>
          {loading ? (
            <p>loading...</p>
          ) : (
            <MyGames
              currUser={props.currUser}
              myGames={myGames && myGames.length ? myGames : null}
              resumeHandler={resumeHandler}
              deleteHandler={deleteHandler}
              giveUpHandler={giveUpHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    currUser: state.auth.currUser,
    authToken: state.auth.authToken,
    availableGames: state.games.availableGames,
    myGames: state.games.myGames,
    joinErr: state.games.joinErr,
    gameId: state.games.gameId
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getGames: () => dispatch(getGames()),
    handleJoinData: data => dispatch(handleJoinGameResponse(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
