import { useState, useEffect } from 'react';
import Home from './Home';
import Table from './Table';
import PostGame from './PostGame';
import Loading from './Loading';
import PlaySound from './components/PlaySound.jsx';
import useApplicationData from './hooks/useApplicationData';
import useGame from './hooks/useGame';

function App() {

  // background music
  // const [backgroundMusic, setBackgroundMusic] = useState(true);

  // useEffect(() => {
  //   setBackgroundMusic(state.view === 'home');
  // }, [state.view]);

  const { gameState, view, setView, player, leaderboard, join, munch, toggleReady, home } = useGame();

  return (
    <div className="App">
      {/* <PlaySound audioSource={
        view === 'loading' ? '/audio/Loadingmusic.mp3' :
        backgroundMusic ? '/audio/mainmenumusic.mp3' : '/audio/quacknoises.mp3'
      } /> */}
      {view === 'loading' && <Loading {...{ setView }} />}
      {view === 'home' && <Home {...{ player, leaderboard, join }} />}
      {view === 'table' && <Table {...{ gameState, munch, toggleReady }} />}
      {view === 'postgame' && <PostGame {...{ join, home }} />}
    </div>
  );
}

export default App;
