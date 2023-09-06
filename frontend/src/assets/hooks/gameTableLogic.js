import { useState, useEffect, useReducer } from 'react';

const ACTIONS = {
  TOGGLE_READY: 'TOGGLE_READY',
  SET_NAME: 'SET_NAME',
  SET_SCORE: 'SET_SCORE',
  TOGGLE_MUNCH: 'TOGGLE_MUNCH',
  UPDATE_READY: 'UPDATE_READY',
  UPDATE_PLAYER_STATES: 'UPDATE_PLAYER_STATES',
  SET_COUNTDOWN_COMPLETE: 'SET_COUNTDOWN_COMPLETE'
};

const {
  TOGGLE_READY,
  SET_NAME,
  SET_SCORE,
  TOGGLE_MUNCH,
  UPDATE_READY,
  UPDATE_PLAYER_STATES,
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
        index === action.payload.seat ? action.payload.name : currentName
      }
    )};
  }
};





const useGameTableLogic = () => {

  const initialState = {
    gameState: {
      marbles: [],
      player: sanitizedPlayer1,
      opponents: [sanitizedPlayer2, sanitizedPlayer3, sanitizedPlayer4],
      isActive: true
    },
    playerReadyStates: [false, false, false, false],
    playerNameStates: ['', '', '', ''],
    playerScoreStates: [0, 0, 0, 0],
    playerMunchStates: [false, false, false, false],
    bugState: [],
    countdownComplete: false
  };


  // const playerMunchStates = [useState(false), useState(false), useState(false), useState(false)];
  // const playerNameStates = [useState(''), useState(''), useState(''), useState('')];
  // const playerScoreStates = [useState(0), useState(0), useState(0), useState(0)];
  // const playerReadyStates = [useState(false), useState(false), useState(false), useState(false)];

  const sanitizedPlayer1 = { name: 'Top Left', current_score: 0, current_seat: 0, isMunching: false, isReady: false };
  const sanitizedPlayer2 = { name: 'Top Right', current_score: 0, current_seat: 1, isMunching: false, isReady: false };
  const sanitizedPlayer3 = { name: 'Bottom Left', current_score: 0, current_seat: 2, isMunching: false, isReady: false };
  const sanitizedPlayer4 = { name: 'Bottom Right', current_score: 0, current_seat: 3, isMunching: false, isReady: false };

  // const [bugState, setBugState] = useState([]);
  // const [gameState, setGameState] = useState({
  //   marbles: [],
  //   player: sanitizedPlayer1,
  //   opponents: [sanitizedPlayer2, sanitizedPlayer3, sanitizedPlayer4],
  //   isActive: true
  // });

  // const munchSounds = ['/audio/munchquack.mp3', '/audio/munchquack2.mp3', '/audio/munchquack3.mp3', '/audio/munchquack4.mp3', '/audio/munchquack5.mp3', '/audio/munchquack6.mp3', '/audio/munchquack7.wav', '/audio/munchquack8.mp3', '/audio/munchquack10.mp3'];
  // const munchAudios = munchSounds.map((sound) => new Audio(sound));


  // /* FUNCTIONS  */
  // const munch = (setMunchStateCB) => {
  //   setMunchStateCB((prev) => {
  //     if (!prev) {
  //       const randomMunchSoundIndex = Math.floor(Math.random() * munchSounds.length);
  //       const munchAudio = munchAudios[randomMunchSoundIndex]; // Select a random audio file
  //       munchAudio.currentTime = 0; // Hard reset for the quack to start immediately
  //       munchAudio.play();
  //       setTimeout(() => {
  //         setMunchStateCB(false);
  //       }, 285);
  //       //makeMunchSound()
  //       return true;
  //     }
  //     return prev;
  //   });
  // };

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
      munch(playerMunchStates[gameState.player.current_seat][1]);
    } //makes munch when spacebar is pressed
  };

  const toggleReady = () => {
    dispatch({ type: TOGGLE_READY });
  };

  const updateName = (player, seat) => {
    // const [name, setName] = playerNameStates[seat];
    dispatch({ type: SET_NAME, payload: { name: player.name, seat } });
  };

  const updateScore = (player, seat) => {
    const [score, setScore] = playerScoreStates[seat];
    if (score !== player.current_score) setScore(player.current_score);
  };

  const updateMunch = (player, seat) => {
    const [isMunching, setIsMunching] = playerMunchStates[seat];
    if (isMunching !== player.isMunching) {
      setIsMunching(player.isMunching);
      if (player.isMunching) {
        munchAudio.currentTime = 0; // makes sure it resets as soon as you press the spacebar
        munchAudio.play();
      }
    }
  };


  const updateReady = (player, seat) => {
    const [isReady, setIsReady] = playerReadyStates[seat];
    if (isReady !== player.isReady && !gameState.isActive) setIsReady(!isReady);
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
        name: playerNameStates[i][0],
        score: playerScoreStates[i][0],
        isReady: playerReadyStates[i][0],
        toggleReady: i === clientIndex ? toggleReady : () => { },
        isMunching: playerMunchStates[i][0]
      });
    }
    return players;
  };

  useEffect(() => {
    updatePlayerStates();
  }, [gameState]);



  // COUNTDOWN LOGIC
  // const [countdownComplete, setCountdownComplete] = useState(false);

  const handleCountdownComplete = () => {
    setCountdownComplete(true);

  };
  // COUNTDOWN LOGIC END


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