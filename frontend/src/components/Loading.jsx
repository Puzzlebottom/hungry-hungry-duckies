import { useRef } from 'react';
import '../sass/Loading.scss';
import Background from './Background';
import getRandomMessage from '../assets/loading_messages';

function Loading() {
  const message = useRef(getRandomMessage());

  return (
    <main className='loading'>
      <Background view={'loading'} />
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
