import { useEffect, useReducer } from 'react';

const ACTIONS = {
  TOGGLE_READY: 'TOGGLE_READY',
  SET_NAME: 'SET_NAME',
  SET_SCORE: 'SET_SCORE',
  TOGGLE_MUNCH: 'TOGGLE_MUNCH',
  START_MUNCH: 'START_MUNCH',
  STOP_MUNCH: 'STOP_MUNCH',
  SET_COUNTDOWN_COMPLETE: 'SET_COUNTDOWN_COMPLETE'
};

const reducer = (state, action) => {
  const player = {...state.player};
  const opponents = state.opponents.map(opponent => { return {...opponent}});
  const players = [player, ...opponents].sort((a, b) => a - b)

  const updatePlayers = (seat, property, value = null) => {
    let updatedPlayers;

    if (!value) {
      updatedPlayers = toggleProperty()
    } else {
      updatedPlayers = updateProperty()
    }

    let updatedPlayer;
    let updatedOpponents = [];

    updatedPlayers.forEach(p => {
      if (p.current_seat === player.current_seat) {
        updatedPlayer = p;
      } else {
        updatedOpponents.push(p)
      }
    })

    const toggleProperty = () => {
      return players.map(p => {
        if (p.current_seat === seat) {p[property] = !p[property]}
      })
    }

    const updateProperty = () => {
      return players.map(p => {
        if (p.current_seat === seat){p[property] = value}
      })
    }

    return {player: updatedPlayer, opponents: updatedOpponents};
  }

switch (action.type) {
    case SET_NAME:
      let { seat } = action.payload
      let {player, opponents} = updatePlayers(seat, 'isReady')
      return { ...state, player, opponents}

    case SET_SCORE:
      return { ...state, playerScoreStates: state.playerScoreStates.map((currentScore, index) => {
        seat = action.payload
        player = updatePlayers(seat, 'current_score', action.payload.score).player
        opponents = updatePlayers(seat, 'current_score', action.payload.score).opponents
        return index === action.payload.seat ? action.payload.score : currentScore
      }
    )};
    case TOGGLE_MUNCH:
      return { ...state, playerMunchStates: state.playerMunchStates.map((munchState, index) => {
        return index === action.payload.seat ? !munchState : munchState
      }
    )};
    case START_MUNCH:
      return { ...state, playerMunchStates: state.playerMunchStates.map((munchState, index) => {
        return index === action.payload.seat ? true : munchState
      }
    )};
    case STOP_MUNCH:
      return { ...state, playerMunchStates: state.playerMunchStates.map((munchState, index) => {
        return index === action.payload.seat ? false : munchState
      }
    )};
    case SET_COUNTDOWN_COMPLETE:
      return { ...state, countdownComplete: true };
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
};






const useGameTableLogic = () => {

  const initialState = {bugs: [], player: {}, opponents:[], isActive: false}
  const [state, dispatch] = useReducer(reducer, initialState);
  const { TOGGLE_READY, SET_NAME, SET_SCORE, TOGGLE_MUNCH, START_MUNCH, STOP_MUNCH, SET_COUNTDOWN_COMPLETE } = ACTIONS;

  const sanitizedPlayer1 = { name: 'Top Left', current_score: 0, current_seat: 0, isMunching: false, isReady: false };
  const sanitizedPlayer2 = { name: 'Top Right', current_score: 0, current_seat: 1, isMunching: false, isReady: false };
  const sanitizedPlayer3 = { name: 'Bottom Left', current_score: 0, current_seat: 2, isMunching: false, isReady: false };
  const sanitizedPlayer4 = { name: 'Bottom Right', current_score: 0, current_seat: 3, isMunching: false, isReady: false };

  const munchSounds = ['/audio/munchquack.mp3', '/audio/munchquack2.mp3', '/audio/munchquack3.mp3', '/audio/munchquack4.mp3', '/audio/munchquack5.mp3', '/audio/munchquack6.mp3', '/audio/munchquack7.wav', '/audio/munchquack8.mp3', '/audio/munchquack10.mp3'];
  const munchAudios = munchSounds.map((sound) => new Audio(sound));

  const gameState = {
      bugs: [],
      player: sanitizedPlayer1,
      opponents: [sanitizedPlayer2, sanitizedPlayer3, sanitizedPlayer4],
      isActive: true
  };

  const munch = (seat) => {
    // if (munchState) {
      const randomMunchSoundIndex = Math.floor(Math.random() * munchSounds.length);
      const munchAudio = munchAudios[randomMunchSoundIndex]; // Select a random audio file
      munchAudio.currentTime = 0; // Hard reset for the quack to start immediately
      munchAudio.play();
      // setTimeout(() => {
      //   dispatch({ type: TOGGLE_MUNCH, payload: { seat } });
      // }, 285);
    // }
  };


  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      console.log('spacebar pressed');
      dispatch({ type: START_MUNCH, payload: { seat: gameState.player.current_seat } });
      munch();
      setTimeout(() => {
        dispatch({ type: STOP_MUNCH, payload: { seat: gameState.player.current_seat } });
      }, 285);
    }
  };

  const toggleReady = (seat) => {
    console.log('toggle ready');
    dispatch({ type: TOGGLE_READY, payload: { seat } });
  };

  const updateName = (player, seat) => {
    dispatch({ type: SET_NAME, payload: { name: player.name, seat } });
  };

  const updateScore = (player, seat) => {
    dispatch({ type: SET_SCORE, payload: { score: player.current_score, seat } });
  };

  const updateMunch = (player, seat) => {
    if (player.isMunching) {
      dispatch({ type: TOGGLE_MUNCH, payload: { seat } });
    }
  };


  const updateReady = (player, seat) => {
    if (!gameState.isActive) {
      dispatch({ type: TOGGLE_READY, payload: { seat } });
    }
  };

  const handleCountdownComplete = () => {
    dispatch({ type: SET_COUNTDOWN_COMPLETE });
  };

  const updatePlayerStates = () => {
    const players = [gameState.player, ...gameState.opponents].sort((a, b) => a.current_seat - b.current_seat);
    players.forEach((player, seat) => {
      updateName(player, seat);
      updateScore(player, seat);
      updateMunch(player, seat);
      updateReady(player, seat);
    });

  };

  const getPlayersArray = () => {
    const players = [];
    const clientIndex = gameState.player.current_seat;

    for (let i = 0; i < 4; i++) {
      players.push({
        seat: i,
        name: playerNameStates[i],
        score: playerScoreStates[i],
        isReady: playerReadyStates[i],
        toggleReady: i === clientIndex ? toggleReady : () => { },
        isMunching: playerMunchStates[i]
      });
    }
    return players;
  };

  useEffect(() => {
    updatePlayerStates();
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    state,
    handleCountdownComplete,
    getPlayersArray
}
};

export default useGameTableLogic;
