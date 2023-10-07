import { useRef } from 'react';
import '../sass/Loading.scss';
import Background from './Background';
import Images from '../assets/images';
import getRandomMessage from '../assets/loading_messages';

function Loading() {
  const message = useRef(getRandomMessage());
  const duckies = Images.marchingDuckies;

  return (
    <main className='loading'>
      <Background view={'loading'} />
      <span>LOADING...</span>
      <div className='sprite-container'>
        <div className='duckie-sprites' style={{ backgroundImage: `url(${duckies})` }}></div>
      </div>
      <span className='message'>{message.current}</span>
    </main>
  );
}

export default Loading;
