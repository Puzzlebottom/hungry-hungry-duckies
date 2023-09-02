import arena from './assets/arena.png';
import duckieTopLeft from './assets/duckie-top-left-1.png';
import duckieTopRight from './assets/duckie-top-right-1.png';
import duckieBottomLeft from './assets/duckie-bottom-left-1.png';
import duckieBottomRight from './assets/duckie-bottom-right-1.png';
import './Table.css';

function Table() {
  return (
    <main>
      <div className='background__green'></div>
      <div className='background__red'></div>
      <div className='background__blue'></div>
      <div className='background__yellow'></div>
      <img src={arena} className='table'></img>
      <img src={duckieTopLeft} className='duckie__top-left'></img>
      <img src={duckieTopRight} className='duckie__top-right'></img>
      <img src={duckieBottomLeft} className='duckie__bottom-left'></img>
      <img src={duckieBottomRight} className='duckie__bottom-right'></img>
    </main>
  );
}

export default Table;
