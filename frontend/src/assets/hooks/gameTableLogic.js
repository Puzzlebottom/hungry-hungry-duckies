import { useEffect, useReducer } from 'react';

const ACTIONS = {
  TOGGLE_READY: 'TOGGLE_READY',
  SET_NAME: 'SET_NAME',
  SET_SCORE: 'SET_SCORE',
  TOGGLE_MUNCH: 'TOGGLE_MUNCH',
  UPDATE_READY: 'UPDATE_READY',
  SET_COUNTDOWN_COMPLETE: 'SET_COUNTDOWN_COMPLETE'
};

const {
  TOGGLE_READY,
  SET_NAME,
  SET_SCORE,
  TOGGLE_MUNCH,
  UPDATE_READY,
  SET_COUNTDOWN_COMPLETE
} = ACTIONS;

const reducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_READY:
      return { ...state, playerReadyStates: state.playerReadyStates.map((readyState, index) => {
        index === state.gameState.player.current_seat ? !readyState : readyState
      })
    };
    case SET_NAME:
      return { ...state, playerNameStates: state.playerNameStates.map((currentName, index) => {
        return index === action.payload.seat ? action.payload.name : currentName
      }
    )};
    case SET_SCORE:
      return { ...state, playerScoreStates: state.playerScoreStates.map((currentScore, index) => {
        return index === action.payload.seat ? action.payload.score : currentScore
      }
    )};
    case TOGGLE_MUNCH:
      return { ...state, playerMunchStates: state.playerMunchStates.map((munchState, index) => {
        index === action.payload.seat ? !munchState : munchState
      }
    )};
    case UPDATE_READY:
      return { ...state, playerReadyStates: state.playerReadyStates.map((readyState, index) => {
        index === action.payload.seat ? !readyState : readyState
      }
    )};
    case SET_COUNTDOWN_COMPLETE:
      return { ...state, countdownComplete: true };
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
};





const useGameTableLogic = () => {

  const sanitizedPlayer1 = { name: 'Top Left', current_score: 0, current_seat: 0, isMunching: false, isReady: false };
  const sanitizedPlayer2 = { name: 'Top Right', current_score: 0, current_seat: 1, isMunching: false, isReady: false };
  const sanitizedPlayer3 = { name: 'Bottom Left', current_score: 0, current_seat: 2, isMunching: false, isReady: false };
  const sanitizedPlayer4 = { name: 'Bottom Right', current_score: 0, current_seat: 3, isMunching: false, isReady: false };

  const initialState = {
    gameState: {
      marbles: [],
      player: sanitizedPlayer1,
      opponents: [sanitizedPlayer2, sanitizedPlayer3, sanitizedPlayer4],
      isActive: true
    },
    playerReadyStates: [false, false, false, false],
    playerNameStates: ['1', '2', '3', '4'],
    playerScoreStates: [0, 0, 0, 0],
    playerMunchStates: [false, false, false, false],
    bugState: [],
    countdownComplete: false
  };







  const munchSounds = ['/audio/munchquack.mp3', '/audio/munchquack2.mp3', '/audio/munchquack3.mp3', '/audio/munchquack4.mp3', '/audio/munchquack5.mp3', '/audio/munchquack6.mp3', '/audio/munchquack7.wav', '/audio/munchquack8.mp3', '/audio/munchquack10.mp3'];
  const munchAudios = munchSounds.map((sound) => new Audio(sound));

  const munch = (seat, munchState) => {
    if (munchState) {
      const randomMunchSoundIndex = Math.floor(Math.random() * munchSounds.length);
      const munchAudio = munchAudios[randomMunchSoundIndex]; // Select a random audio file
      munchAudio.currentTime = 0; // Hard reset for the quack to start immediately
      munchAudio.play();
      setTimeout(() => {
        dispatch({ type: TOGGLE_MUNCH, payload: { seat } });
      }, 285);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    gameState,
    playerReadyStates,
    playerNameStates,
    playerScoreStates,
    playerMunchStates,
    bugState,
    countdownComplete
  } = state;


  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      console.log('spacebar pressed');
      munch(gameState.player.current_seat, playerMunchStates[gameState.player.current_seat]);
    } //makes munch when spacebar is pressed
  };

  const toggleReady = () => {
    dispatch({ type: TOGGLE_READY });
  };

  const updateName = (player, seat) => {
    dispatch({ type: SET_NAME, payload: { name: player.name, seat } });
  };

  const updateScore = (player, seat) => {
    dispatch({ type: SET_SCORE, payload: { score: player.current_score, seat } });
  };

  const updateMunch = (player, seat) => {
    // const [isMunching, setIsMunching] = playerMunchStates[seat];
    // if (isMunching !== player.isMunching) {
    //   setIsMunching(player.isMunching);
    //   if (player.isMunching) {
    //     munchAudio.currentTime = 0; // makes sure it resets as soon as you press the spacebar
    //     munchAudio.play();
    //   }
    // }
    if (player.isMunching) {
      dispatch({ type: TOGGLE_MUNCH, payload: { seat } });
    }
  };


  const updateReady = (player, seat) => {
    // const [isReady, setIsReady] = playerReadyStates[seat];
    // if (isReady !== player.isReady && !gameState.isActive) setIsReady(!isReady);
    if (player.isReady !== playerReadyStates[seat][0] && !gameState.isActive) {
      dispatch({ type: UPDATE_READY, payload: { seat } });
    }
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




  const handleCountdownComplete = () => {
    dispatch({ type: SET_COUNTDOWN_COMPLETE });
  };



  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    bugState,
    handleCountdownComplete,
    countdownComplete,
    getPlayersArray
}
};

export default useGameTableLogic;
