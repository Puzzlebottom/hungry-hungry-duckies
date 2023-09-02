import arena from './assets/arena.png';
import duckieTopLeft from './assets/duckie-top-left-1.png';
import duckieTopRight from './assets/duckie-top-right-1.png';
import duckieBottomLeft from './assets/duckie-bottom-left-1.png';
import duckieBottomRight from './assets/duckie-bottom-right-1.png';
import '../public/stylesheets/Table.css';

function Table() {
  return (
    <main>
      <img src={arena} className='table'></img>
      <span className='countdown'>GO!</span>
      <span className='timer'>12:59</span>
      <div className='background background__green'></div>
      <div className='player-detail-panel player-detail-panel__top-left'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieTopLeft} className='duckie__top-left'></img>
      <div className='background background__red'></div>
      <div className='player-detail-panel player-detail-panel__top-right'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieTopRight} className='duckie__top-right'></img>
      <div className='background background__blue'></div>
      <div className='player-detail-panel player-detail-panel__bottom-left'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieBottomLeft} className='duckie__bottom-left'></img>
      <div className='background background__yellow'></div>
      <div className='player-detail-panel player-detail-panel__bottom-right'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieBottomRight} className='duckie__bottom-right'></img>
    </main>
  );
}

export default Table;
