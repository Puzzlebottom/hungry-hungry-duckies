import Home from './components/Home';
import Table from './components/Table';
import PostGame from './components/PostGame';
import Loading from './components/Loading';
import useGame from './hooks/useGame';
import useAudio from './hooks/useAudio';
import { useEffect } from 'react';
import './sass/App.scss';


function App() {
  const { gameState, setView, player, leaderboard, join, munch, toggleReady, home, newGame, message } = useGame();
  const { getAudioPlayerRef, playMusic, isMuted, toggleMute } = useAudio();
  const { view, music } = gameState;
  const audioPlayer = getAudioPlayerRef();

  const handleClick = () => {
    toggleMute();
    playMusic(music);
    window.removeEventListener('mousedown', handleClick);
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    playMusic(music);
  }, [music]);

  return (
    <div className="App">
      <div className='mute-button' onClick={toggleMute}>
        {isMuted && <img src="/images/mute-button-off.png" alt="mute button" />}
        {!isMuted && <img src="/images/mute-button-on.png" alt="mute button" />}
      </div>
      <audio ref={audioPlayer} loop={true} muted={true} />
      {view === 'loading' && <Loading {...{ setView }} />}
      {view === 'home' && <Home {...{ player, leaderboard, join }} />}
      {view === 'table' && <Table {...{ gameState, munch, toggleReady, message }} />}
      {view === 'postgame' && <PostGame {...{ gameState, home, newGame }} />}
    </div>
  );
}

export default App;
