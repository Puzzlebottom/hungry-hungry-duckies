import { useEffect } from 'react';
import '../sass/Table.scss';
import Images from '../assets/images';
import Background from './Background';
import Quarter from './Quarter';
import Bugs from './Bugs';
import GameTimer from './GameTimer';
import Countdown from './Countdown';

function Table({ gameState, munch, toggleReady, message }) {

  const { bugs, player, opponents, isActive } = gameState;

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      munch();
    }
    if (e.key === 'q') {
      e.preventDefault();
      message();
    }
  };

  const handleClick = () => {
    munch();
  };


  const getPlayers = () => {
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
    const images = Images.duckies[index];
    return <Quarter key={index} {...{ images, player, isActive }} />;
  });

  return (
    <main className='table'>
      <Background view={'table'} />
      <img src={Images.arena} className="arena" />
      <div className='color-overlays'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Bugs bugState={bugs} />
      {quarters}
      {isActive && <Countdown {...{ bugs, isActive }} />}
      {isActive && bugs.length > 0 && <GameTimer initialMinutes={60} initialSeconds={0} />}
    </main>
  );
}


export default Table;
