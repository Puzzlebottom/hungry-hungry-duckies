import { useEffect, useReducer } from "react";
import { socket } from '../socket';
import useConnect from './useConnect';
import useView from './useView';


const ACTIONS = {
  UPDATE: 'UPDATE',
  MUNCH: 'MUNCH'
};

const reducers = {
  UPDATE(state, action) {
    if (state.isActive === true && action.value.isActive === false) {
      //change view to postgame
    }
    return action.value;
  },

  MUNCH(state, action) {
    const updatedGameState = { ...state, player: { ...state.player, isMunching: action.value } };
    return updatedGameState;
  }
};

const reducer = (state, action) => {
  if (reducers[action.type]) {
    return reducers[action.type](state, action);
  }
  return state;
};

const useGame = () => {
  const { view, setView } = useView();
  const { player, setPlayer, leaderboard } = useConnect(setView);

  const initialState = ({ bugs: [], player: {}, opponents: [], isActive: false, view: 'loading' });
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const { UPDATE, MUNCH } = ACTIONS;

  const join = (player) => {
    socket.emit('join', player);
    setPlayer(player);
    setView('loading');
    setTimeout(() => {
      setView('table');
    }, 2000);
  };

  const munch = () => {
    if (gameState.isActive && !gameState.player.isMunching) {
      socket.emit('munch');
      dispatch({ type: MUNCH, value: true });
      setTimeout(() => {
        dispatch({ type: MUNCH, value: false });
      }, 285);
    }
  };

  const toggleReady = () => {
    socket.emit('ready');
  };

  const home = () => {
    //redirect to slash
  };

  useEffect(() => {
    socket.on('gameState', (gameState) => {
      dispatch({ type: UPDATE, value: gameState });
    });

    return () => {
      socket.off('gameState');
    };
  }, []);

  return { gameState, view, setView, player, leaderboard, join, munch, toggleReady, home };
};

export default useGame;
