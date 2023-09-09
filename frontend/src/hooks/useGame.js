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
    if (state.isActive && !action.value.isActive) {
      return { ...action.value, view: 'postgame' };
    }
    return { ...state, ...action.value };
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

  const initialState = ({ bugs: [], player: {}, opponents: [], isActive: false, view: 'loading' });
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const { UPDATE, MUNCH, SET_VIEW } = ACTIONS;

  useEffect(() => {
    socket.on('gameState', (gameState) => {
      dispatch({ type: UPDATE, value: gameState });
    });

    return () => {
      socket.off('gameState');
    };
  }, []);

  return { gameState, setView, player, leaderboard, join, munch, toggleReady, home, newGame };
};

export default useGame;
