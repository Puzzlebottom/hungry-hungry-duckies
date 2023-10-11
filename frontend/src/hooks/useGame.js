import { useEffect, useReducer } from "react";
import { socket } from '../socket';
import useConnect from './useConnect';
import messages from "../assets/player_messages.js";


const ACTIONS = {
  UPDATE: 'UPDATE',
  MUNCH: 'MUNCH',
  SET_VIEW: 'SET_VIEW',
  TOGGLE_MESSAGE: 'TOGGLE_MESSAGE'
};

const reducers = {
  UPDATE(state, action) {
    const { gameState, player } = action.value;

    if (state.isActive && !gameState.isActive) {
      socket.emit('update', { ...player, current_score: gameState.player.current_score });
      return { ...gameState, view: 'postgame', music: 'theme' };
    }

    const updatedGameState = { ...gameState, player: { ...gameState.player, isMunching: state.player.isMunching } };
    return { ...state, ...updatedGameState };
  },

  MUNCH(state, action) {
    const updatedGameState = { ...state, player: { ...state.player, isMunching: action.value } };
    return updatedGameState;
  },

  SET_VIEW(state, action) {
    let music = 'theme';
    if (action.value === 'loading') music = 'loading';
    if (action.value === 'home') music = 'menu';

    return { ...state, view: action.value, music };
  },

  TOGGLE_MESSAGE(state, action) {
    return { ...state, player: { ...state.player, showMessage: action.value } };
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

  const message = () => {
    if (!gameState.bugs.length) return;
    if (!gameState.isActive) return;
    if (gameState.player.showMessage) return;
    const timeOut = 2000;
    const message = messages[Math.floor(Math.random() * messages.length)];
    socket.emit('message', { message, timeOut });
    dispatch({ type: TOGGLE_MESSAGE, value: message });
    setTimeout(() => {
      dispatch({ type: TOGGLE_MESSAGE, value: false });
    }, timeOut);
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

  const initialState = ({ bugs: [], player: {}, opponents: [], isActive: false, view: '', music: 'menu', showMessage: false });
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const { UPDATE, MUNCH, SET_VIEW, TOGGLE_MESSAGE } = ACTIONS;

  useEffect(() => {
    socket.on('gameState', (gameState) => {
      dispatch({ type: UPDATE, value: { gameState, player } });
    });

    socket.on('disconnect', () => {
      dispatch({ type: SET_VIEW, value: 'loading' });
      setTimeout(() => {
        location.reload();
      }, 100);
    });

    return () => {
      socket.off('gameState');
    };
  }, [player, gameState]);

  return { gameState, setView, player, leaderboard, join, munch, toggleReady, home, newGame, message };
};

export default useGame;
