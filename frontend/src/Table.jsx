import { useState, useEffect } from 'react';
import { Bodies } from 'matter-js';

import bug1 from './assets/bug1.png';

import arena from './assets/arena.png';
import topLeft1 from './assets/duckie-top-left-1.png';
import topLeft2 from './assets/duckie-top-left-2.png';
import topLeft3 from './assets/duckie-top-left-3.png';
import topRight1 from './assets/duckie-top-right-1.png';
import topRight2 from './assets/duckie-top-right-2.png';
import topRight3 from './assets/duckie-top-right-3.png';
import bottomLeft1 from './assets/duckie-bottom-left-1.png';
import bottomLeft2 from './assets/duckie-bottom-left-2.png';
import bottomLeft3 from './assets/duckie-bottom-left-3.png';
import bottomRight1 from './assets/duckie-bottom-right-1.png';
import bottomRight2 from './assets/duckie-bottom-right-2.png';
import bottomRight3 from './assets/duckie-bottom-right-3.png';

// import '../stylesheets/Table.css';
import Quarter from './components/Quarter';
import Bugs from './components/Bugs';

const sanitizedPlayer1 = { name: 'Top Left', current_score: 0, current_seat: 0, isMunching: false, isReady: false };
const sanitizedPlayer2 = { name: 'Top Right', current_score: 0, current_seat: 1, isMunching: false, isReady: false };
const sanitizedPlayer3 = { name: 'Bottom Left', current_score: 0, current_seat: 2, isMunching: false, isReady: false };
const sanitizedPlayer4 = { name: 'Bottom Right', current_score: 0, current_seat: 3, isMunching: false, isReady: false };

function Table(props) {

  const duckieImages = [
    [topLeft1, topLeft2, topLeft3],
    [topRight1, topRight2, topRight3],
    [bottomLeft1, bottomLeft2, bottomLeft3],
    [bottomRight1, bottomRight2, bottomRight3]
  ];

  const playerMunchStates = [useState(false), useState(false), useState(false), useState(false)];
  const playerNameStates = [useState(''), useState(''), useState(''), useState('')];
  const playerScoreStates = [useState(0), useState(0), useState(0), useState(0)];
  const playerReadyStates = [useState(false), useState(false), useState(false), useState(false)];

  const [gameState, setGameState] = useState({ marbles: [], player: sanitizedPlayer1, opponents: [sanitizedPlayer2, sanitizedPlayer3, sanitizedPlayer4], isActive: true });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const munch = (setMunchStateCB) => {
    setMunchStateCB((prev) => {
      if (!prev) {
        setTimeout(() => {
          setMunchStateCB(false);
        }, 285);
        //makeMunchSound()
        return true;
      }
      return prev;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      munch(playerMunchStates[gameState.player.current_seat][1]);
      //emitMunch()
    }
  };

  const toggleReady = () => {
    const [isReady, setIsReady] = playerReadyStates[gameState.player.current_seat];
    setIsReady(() => {
      //emitToggleReady()
      return !isReady;
    });
  };

  const updateName = (player, seat) => {
    const [name, setName] = playerNameStates[seat];
    if (name !== player.name) setName(player.name);
  };

  const updateScore = (player, seat) => {
    const [score, setScore] = playerScoreStates[seat];
    if (score !== player.current_score) setScore(player.current_score);
  };

  const updateMunch = (player, seat) => {
    const [isMunching, setIsMunching] = playerMunchStates[seat];
    if (isMunching !== player.isMunching) munch(setIsMunching);
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
        isMunching: playerMunchStates[i][0],
      });
    }
    return players;
  };

  useEffect(() => {
    //checkIsActive()
    updatePlayerStates();
    //updateBugs();
  }, [gameState]);

  // const mockGameState = (playerNumber) => {
  //   const newGamesState = { ...gameState };
  //   if (playerNumber === 2) {
  //     newGamesState.opponents[0].isMunching = true;
  //   } else if (playerNumber === 3) {
  //     newGamesState.opponents[1].isMunching = true;
  //   } else if (playerNumber === 4) {
  //     newGamesState.opponents[2].isMunching = true;
  //   }
  //   setGameState(newGamesState);
  //   setTimeout(() => {
  //     const newGamesState = { ...gameState };
  //     newGamesState.opponents.forEach(opp => {
  //       opp.isMunching = false;
  //     });
  //     setGameState(newGamesState);
  //   }, 300);
  // };

  const [bugUpdate, setBugUpdate] = useState([]);

  const mockBug = () => Bodies.circle(document.body.clientWidth / 2, document.body.clientHeight / 2, 15, {
    restitution: 0, friction: -0.2, frictionAir: 0.01, frictionStatic: 0, label: 'bug',
    render: {
      sprite: {
        texture: bug1,
        xScale: 0.25,
        yScale: 0.25,
        yOffset: -0.05
      }
    }
  });
  const mockBugs = [mockBug(), mockBug()];

  const setMockBugs = () => {
    console.log('update!');
    setBugUpdate(mockBugs);
  };

  useEffect(() => {

    window.addEventListener('mousedown', setMockBugs);

    return () => window.removeEventListener('mousedown', setMockBugs);
  });

  const quarters = getPlayersArray().map((player, index) => {
    const images = duckieImages[index];
    const color = ['green', 'red', 'blue', 'yellow'][index];
    return <Quarter key={index} {...{ images, player, color }} />;
  });

  return (
    <main className='table-view'>
      <img src={arena} className='arena' />
      <Bugs bugUpdate={bugUpdate} />
      <span className='timer'>12:59</span>
      {/* <span className='countdown'>GO!</span> */}
      {/* {quarters} */}
    </main>
  );
}

export default Table;
