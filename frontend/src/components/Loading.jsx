import { useRef } from 'react';
import backgrounds from '../assets/wallpaper';
import '../sass/Loading.scss';
import getRandomMessage from '../assets/loading_messages';

function Loading() {
  const message = useRef(getRandomMessage());
  const [sky, mountains, clouds] = backgrounds.Loading;


  return (
    <main className='loading-view'>
      <img className="background-container sky-loading" src={sky}></img>
      <img className="background-container mountain-loading" src={mountains}></img>
      <img className="background-container clouds-loading" src={clouds}></img>
      <div className="sprite-container">
        <div className='sprite-animation'></div>
      </div>
      <span className='loading-message'>
        <h5>LOADING...</h5>
      </span>
      <div className='instructions'>
        <span>{message.current}</span>
      </div>
    </main>
  );
}

export default Loading;
