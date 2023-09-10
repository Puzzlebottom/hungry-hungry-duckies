import { useRef } from 'react';
import backgrounds from './assets/wallpaper';

import '../sass/Loading.scss';
import getRandomMessage from '../assets/loading_messages';

function Loading() {
  const message = useRef(getRandomMessage());

  return (
    <main className='loading-view'>
      <div className="background-container sky-loading" style={{ backgroundImage: `url(${backgrounds.Loading[0]})` }}></div>
      <div className="background-container mountain-loading" style={{ backgroundImage: `url(${backgrounds.Loading[1]})` }}></div>
      <div className="background-container clouds-loading"s tyle={{ backgroundImage: `url(${backgrounds.Loading[2]})` }}></div>
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
};

export default Loading;
