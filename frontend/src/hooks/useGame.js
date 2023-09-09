import { useEffect, useReducer } from "react";
import { socket } from '../socket';
import useConnect from './useConnect';


const ACTIONS = {
  UPDATE: 'UPDATE',
  MUNCH: 'MUNCH',
  SET_VIEW: 'SET_VIEW'
};

const reducers = {
  UPDATE(state, action) {
    const { gameState, player } = action.value;

    if (state.isActive && !gameState.isActive) {
      socket.emit('update', {...player, current_score: gameState.player.current_score});
      return { ...gameState, view: 'postgame' };
    }
    return { ...state, ...gameState };
  },

  MUNCH(state, action) {
    const updatedGameState = { ...state, player: { ...state.player, isMunching: action.value } };
    return updatedGameState;
  },

  SET_VIEW(state, action) {
    return { ...state, view: action.value };
  }
};

const reducer = (state, action) => {
  if (reducers[action.type]) {
    return reducers[action.type](state, action);
  }
  return state;
};

const useGame = () => {
  const setView = (view) => {
    dispatch({ type: SET_VIEW, value: view });
  };

  const join = (player) => {
    socket.emit('join', player);
    setPlayer(player);
    setView('loading');
    setTimeout(() => {
      setView('table');
    }, 2000);
  };

  const munch = () => {
    if (!gameState.bugs.length) return;

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
    socket.emit('home');
    dispatch({ type: SET_VIEW, value: 'home' });
  };

  const newGame = (playerName) => {
    socket.emit('newgame', playerName);
    dispatch({ type: SET_VIEW, value: 'table' });
  };

  const { player, setPlayer, leaderboard } = useConnect(setView);
  console.log('player in useGame', player)

  const initialState = ({ bugs: [], player: {}, opponents: [], isActive: false, view: 'loading' });
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const { UPDATE, MUNCH, SET_VIEW } = ACTIONS;

  useEffect(() => {
    socket.on('gameState', (gameState) => {
      console.log('gameState', player)
      dispatch({ type: UPDATE, value: { gameState, player } });
    });

    return () => {
      socket.off('gameState');
    };
  }, [player]);

  return { gameState, setView, player, leaderboard, join, munch, toggleReady, home, newGame };
};

export default useGame;
