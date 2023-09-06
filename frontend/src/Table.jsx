import React, { useState, useEffect } from 'react';

import arena from './assets/arena.png';
import topLeft1 from './assets/duckie-top-left-1.png';
import topLeft2 from './assets/duckie-top-left-2.png';
import topLeft3 from './assets/duckie-top-left-3.png';
import topRight1 from './assets/duckie-top-right-1.png';
import topRight2 from './assets/duckie-top-right-2.png';
import topRight3 from './assets/duckie-top-right-3.png';
import bottomLeft1 from './assets/duckie-bottom-left-1.png';
import bottomLeft2 from './assets/duckie-bottom-left-2.png';
import bottomLeft3 from './assets/duckie-bottom-left-3.png';
import bottomRight1 from './assets/duckie-bottom-right-1.png';
import bottomRight2 from './assets/duckie-bottom-right-2.png';
import bottomRight3 from './assets/duckie-bottom-right-3.png';
import PlaySound from './components/PlaySound.jsx';
import useGameTableLogic from './assets/hooks/gameTableLogic';

import Quarter from './components/Quarter';
import Bugs from './components/Bugs';
import GameTimer from './components/Gametimer';
import Countdown from './components/Countdown';


function Table(props) {

  const {
    bugState,
    handleCountdownComplete,
    countdownComplete,
    getPlayersArray
  } = useGameTableLogic();

  const duckieImages = [
    [topLeft1, topLeft2, topLeft3],
    [topRight1, topRight2, topRight3],
    [bottomLeft1, bottomLeft2, bottomLeft3],
    [bottomRight1, bottomRight2, bottomRight3]
  ];

const quarters = getPlayersArray().map((player, index) => {
  const images = duckieImages[index];
  const color = ['green', 'red', 'blue', 'yellow'][index];
  return <Quarter key={index} {...{ images, player, color }} />;
});


  return (
    <main className='table-view'>
      <img src={arena} className='arena' />

      <Bugs bugState={bugState} />
      {quarters}
      <Countdown seconds={3} onComplete={handleCountdownComplete} />
      {countdownComplete && (<GameTimer initialMinutes={12} initialSeconds={59} />)};
    </main>
  );
}

export default Table;
