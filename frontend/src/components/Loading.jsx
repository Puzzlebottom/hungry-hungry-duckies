import { useRef } from 'react';

import '../sass/Loading.scss';
import getRandomMessage from '../assets/loading_messages';

function Loading() {
  const message = useRef(getRandomMessage());

  return (
    <main className='loading-view'>
      <div className="background-container sky-loading"></div>
      <div className="background-container mountain-loading"></div>
      <div className="background-container clouds-loading"></div>
      <div className="sprite-container">
        <div className='sprite-animation'></div>
      </div>
      <span className='loading-message'>
        <h3>LOADING...</h3>
      </span>
      <div className='instructions'>
        <span>{message.current}</span>
      </div>
    </main>
  );
};

export default Loading;
