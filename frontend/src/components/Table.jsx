import { useEffect } from 'react';
import '../sass/Table.scss';
import Images from '../assets/images';
import Background from './Background';
import backgrounds from '../assets/wallpaper';
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
  // const quarterPanels = ['green', 'red', 'blue', 'yellow'].map((color, index) => {
  //   return <div key={index} className={'background background__' + color}></div>;
  // });


  return (
    <main className='table'>
      <Background view={'table'} />
      {/* <div className="Table-Topblocks" style={{ backgroundImage: `url(${backgrounds.Table[1]})` }}>
      </div>
      <div className="Table-Rightblocks" style={{ backgroundImage: `url(${backgrounds.Table[2]})` }}>
      </div>
      <div className="Table-Bottomblocks" style={{ backgroundImage: `url(${backgrounds.Table[4]})` }}>
      </div>
      <div className="Table-Leftblocks" style={{ backgroundImage: `url(${backgrounds.Table[3]})` }}>
      </div> */}
      {/* {quarterPanels} */}
      {/* <main className="table-view" style={{ backgroundImage: `url(${backgrounds.Table[0]})` }}>
        <img src={Images.arena} className="arena" />
        <Bugs bugState={bugs} />
        {quarters}
        {isActive && <Countdown {...{ bugs, isActive }} />}
        {isActive && <GameTimer initialMinutes={12} initialSeconds={59} />}
      </main> */}
    </main>
  );
}


export default Table;
