import Home from './Home';
import Table from './Table';
import PostGame from './PostGame';
import Loading from './Loading';
import useGame from './hooks/useGame';
import useAudio from './hooks/useAudio';
import { useEffect } from 'react';
import '../public/stylesheets/AudioControls.css';

function App() {
  const { gameState, setView, player, leaderboard, join, munch, toggleReady, home, newGame } = useGame();
  const { getAudioPlayerRef, playMusic, isMuted, toggleMute } = useAudio();
  const { view } = gameState;
  const audioPlayer = getAudioPlayerRef();

  const handleClick = () => {
    toggleMute();
    playMusic(view);
    window.removeEventListener('mousedown', handleClick);
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    playMusic(view);
  }, [view]);

  return (
    <div className="App">
      <div className='mute-button' onClick={toggleMute}>
        {isMuted && <img src={"https://freesvg.org/img/pink_button_sound_off_morgaine1976.png"} alt="mute button" />}
        {!isMuted && <img src="https://freesvg.org/img/pink_button_sound_on_morgaine1976.png" alt="mute button" />}
      </div>
      <audio ref={audioPlayer} loop={true} muted={true} />
      {view === 'loading' && <Loading {...{ setView }} />}
      {view === 'home' && <Home {...{ player, leaderboard, join }} />}
      {view === 'table' && <Table {...{ gameState, munch, toggleReady }} />}
      {view === 'postgame' && <PostGame {...{ gameState, home, newGame }} />}
    </div>
  );
}

export default App;
