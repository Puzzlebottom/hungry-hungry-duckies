import { useState, useEffect } from 'react';

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

import Duckie from './components/Duckie';
import Bugs from './components/Bugs';

const sanitizedPlayer1 = { name: 'Top Left', current_score: 0, current_seat: 0, isMunching: true };
const sanitizedPlayer2 = { name: 'Top Right', current_score: 0, current_seat: 1, isMunching: false };
const sanitizedPlayer3 = { name: 'Bottom Left', current_score: 0, current_seat: 2, isMunching: false };
const sanitizedPlayer4 = { name: 'Bottom Right', current_score: 0, current_seat: 3, isMunching: false };

function Table(props) {

  const duckieImages = [
    [topLeft1, topLeft2, topLeft3],
    [topRight1, topRight2, topRight3],
    [bottomLeft1, bottomLeft2, bottomLeft3],
    [bottomRight1, bottomRight2, bottomRight3]
  ];

  const playerMunchStates = [useState(false), useState(false), useState(false), useState(false)];
  const [gameState, setGameState] = useState({ marbles: [], player: sanitizedPlayer1, opponents: [sanitizedPlayer2, sanitizedPlayer3, sanitizedPlayer4], isActive: true });
  const [isMunchingPlayer1] = playerMunchStates[0];
  const [isMunchingPlayer2] = playerMunchStates[1];
  const [isMunchingPlayer3] = playerMunchStates[2];
  const [isMunchingPlayer4] = playerMunchStates[3];


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const munch = (setMunchStateCB) => {
    setMunchStateCB((prev) => {
      if (!prev) {
        setTimeout(() => {
          setMunchStateCB(false);
        }, 285);
        return true;
      }
      return prev;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      munch(playerMunchStates[gameState.player.current_seat][1]);
    }
  };

  useEffect(() => {
    gameState.opponents.forEach(opponent => {
      if (opponent.isMunching === true) {
        munch(playerMunchStates[opponent.current_seat][1]);
      }
    });
  }, [gameState]);

  const mockGameState = (playerNumber) => {
    const newGamesState = { ...gameState };
    if (playerNumber === 2) {
      newGamesState.opponents[0].isMunching = true;
    } else if (playerNumber === 3) {
      newGamesState.opponents[1].isMunching = true;
    } else if (playerNumber === 4) {
      newGamesState.opponents[2].isMunching = true;
    }
    setGameState(newGamesState);
    setTimeout(() => {
      const newGamesState = { ...gameState };
      newGamesState.opponents.forEach(opp => {
        opp.isMunching = false;
      });
      setGameState(newGamesState);
    }, 300);
  };

  return (
    <main className='table-view'>
      <img src={arena} className='table' />
      <Bugs />
      <span className='timer'>12:59</span>
      {/* <span className='countdown'>GO!</span> */}
      <div className='background background__green'></div>
      <div className='player-detail-panel player-detail-panel__top-left'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <Duckie images={duckieImages[0]} isMunching={isMunchingPlayer1} />
      <div className='background background__red'></div>
      <div className='player-detail-panel player-detail-panel__top-right'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready' onClick={() => mockGameState(2)}>Ready?</button>
      </div>
      <Duckie images={duckieImages[1]} isMunching={isMunchingPlayer2} />
      <div className='background background__blue'></div>
      <div className='player-detail-panel player-detail-panel__bottom-left'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready' onClick={() => mockGameState(3)}>Ready?</button>
      </div>
      <Duckie images={duckieImages[2]} isMunching={isMunchingPlayer3} />
      <div className='background background__yellow'></div>
      <div className='player-detail-panel player-detail-panel__bottom-right'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready' onClick={() => mockGameState(4)}>Ready?</button>
      </div>
      <Duckie images={duckieImages[3]} isMunching={isMunchingPlayer4} />
    </main>
  );
}

export default Table;
