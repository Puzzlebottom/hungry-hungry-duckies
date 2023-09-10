import { useEffect } from 'react';
import Images from './assets/images';
import backgrounds from './assets/wallpaper';
import Quarter from './components/Quarter';
import Bugs from './components/Bugs';
import GameTimer from './components/Gametimer';
import Countdown from './components/Countdown';

function Table({ gameState, munch, toggleReady }) {

  const { bugs, player, opponents, isActive } = gameState;

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
    const color = ['green', 'red', 'blue', 'yellow'][index];
    return <Quarter key={index} {...{ images, player, color, isActive }} />;
  });


  return (
    <main className='table-view' style={{ backgroundImage: `url(${backgrounds.Table[0]})` }}>
      <img src={Images.arena} className='arena' />
      <Bugs bugState={bugs} />
      {quarters}
      {isActive && <Countdown {...{ bugs, isActive }} />}
      {isActive && (<GameTimer initialMinutes={12} initialSeconds={59} />)};
    </main>
  );
}


export default Table;
