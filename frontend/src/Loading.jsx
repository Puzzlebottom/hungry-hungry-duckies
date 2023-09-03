import '../public/stylesheets/Loading.css';
import duckieTopLeft from './assets/duckie-top-left-no-shadow-1.png';
import duckieTopRight from './assets/duckie-top-right-no-shadow-1.png';
import duckieBottomLeft from './assets/duckie-bottom-left-no-shadow-1.png';
import duckieBottomRight from './assets/duckie-bottom-right-no-shadow-1.png';

function Loading() {
  return (
    <main className='loading-view'>
      <div className="duckie-container rotate">
        <img src={duckieTopLeft} className='duckie__top-left'></img>
        <img src={duckieTopRight} className='duckie__top-right'></img>
        <img src={duckieBottomLeft} className='duckie__bottom-left'></img>
        <img src={duckieBottomRight} className='duckie__bottom-right'></img>
      </div>
      <span className='loading-message'>
        <h3>LOADING...</h3>
      </span>
      <div className='instructions'>
        <span>Spacebar to eat bugs</span>
        <span>Spacebar to quack</span>
      </div>
    </main>
  );
}

export default Loading;
