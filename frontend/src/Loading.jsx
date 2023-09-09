import React from 'react';
import '../public/stylesheets/Loading.css';
import getRandomMessage from './assets/loading_messages';

function Loading(props) {
  const changeView = () => {
    props.handleViewChange('table');
  };

  setTimeout(changeView, 3000);

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
        <span>{getRandomMessage()}</span>
      </div>
    </main>
  );
};

export default Loading;
