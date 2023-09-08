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

import Quarter from './components/Quarter';
import Bugs from './components/Bugs';
import GameTimer from './components/Gametimer';
import Countdown from './components/Countdown';
import videoBackground from '../public/videos/badass.mp4';

function Table({ gameState, munch, toggleReady }) {
  const duckieImages = [
    [topLeft1, topLeft2, topLeft3],
    [topRight1, topRight2, topRight3],
    [bottomLeft1, bottomLeft2, bottomLeft3],
    [bottomRight1, bottomRight2, bottomRight3]
  ];

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      munch();
    }
  };

  const getPlayers = () => {
    const { player, opponents } = gameState;

    const players = [{ ...player }, ...opponents]
      .filter(p => [0, 1, 2, 3].includes(p.current_seat))
      .map((p => {
        const isClient = p.current_seat === player.current_seat;
        p.toggleReady = isClient ? toggleReady : () => { };
        return p;
      }));

    return players;
  };

  const quarters = getPlayers().map((player) => {
    const index = player.current_seat;
    const images = duckieImages[index];
    const color = ['green', 'red', 'blue', 'yellow'][index];
    return <Quarter key={index} {...{ images, player, color }} />;
  });

  const [countdownComplete, setCountdownComplete] = useState(false);

  const handleCountdownComplete = () => {
    setCountdownComplete(true);
  };

  return (
    <main className='table-view'>
      <video className="background-video" autoPlay loop muted>
        <source src={videoBackground} type="video/mp4" />
      </video>
      <img src={arena} className='arena' />
      <Bugs bugState={gameState.bugs} />
      {quarters}
      {/* <Countdown seconds={3} onComplete={handleCountdownComplete} /> */}
      {countdownComplete && (<GameTimer initialMinutes={12} initialSeconds={59} />)};
    </main>
  );
}


export default Table;
