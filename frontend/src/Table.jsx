import React, { useState, useEffect } from 'react';
import arena from './assets/arena.png';
import duckieTopLeft from './assets/duckie-top-left-1.png';
import duckieTopRight from './assets/duckie-top-right-1.png';
import duckieBottomLeft from './assets/duckie-bottom-left-1.png';
import duckieBottomRight from './assets/duckie-bottom-right-1.png';
import '../public/stylesheets/Table.css';
import Bugs from './components/Bugs';
import Countdown from './components/Countdown';

function Table() {
  const [countdown, setCountdown] = useState(3); //this starts the count at the number 3 since it is [MUNCH!, 1, 2, 3]

  useEffect(() => {
    // this should start the countdown automatically
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);// repeats the previous step every second
    return () => clearInterval(countdownInterval); // this should clear everything at the end once thee count is finished
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      // this is where we would put the logic to begin the game at the end of the count im not sure yet how to implement this
      //that bridge will be crossed wen we get there
    }
  }, [countdown]);

  // paste the following beelow timer for it add countdown <Countdown seconds={countdown} onComplete={() => {}} />

  return (
    <main>
      <img src={arena} className='table' alt='Table' />
      <Bugs />
      <span className='timer'>12:59</span>

      <div className='background background__green'></div>
      <div className='player-detail-panel player-detail-panel__top-left'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieTopLeft} className='duckie__top-left' alt='Duckie Top Left' />
      <div className='background background__red'></div>
      <div className='player-detail-panel player-detail-panel__top-right'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieTopRight} className='duckie__top-right' alt='Duckie Top Right' />
      <div className='background background__blue'></div>
      <div className='player-detail-panel player-detail-panel__bottom-left'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieBottomLeft} className='duckie__bottom-left' alt='Duckie Bottom Left' />
      <div className='background background__yellow'></div>
      <div className='player-detail-panel player-detail-panel__bottom-right'>
        <span className='player-name'>Player Name</span>
        <span className='score'>0</span>
        <button className='button__ready'>Ready?</button>
      </div>
      <img src={duckieBottomRight} className='duckie__bottom-right' alt='Duckie Bottom Right' />
    </main>
  );
}

export default Table;
