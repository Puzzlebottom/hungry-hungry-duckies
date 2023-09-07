import Home from './Home';
import Table from './Table';
import PostGame from './PostGame';
import Loading from './Loading';
import PlaySound from './components/PlaySound.jsx';
import useGame from './hooks/useGame';

function App() {
  const { gameState, view, setView, player, leaderboard, join, munch, toggleReady, home } = useGame();

  let track = '/audio/quacknoises.mp3';
  if (view === 'loading') track = '/audio/Loadingmusic.mp3';
  if (view === 'home') track = '/audio/mainmenumusic.mp3';

  return (
    <div className="App">
      <PlaySound audioSource={track} />
      {view === 'loading' && <Loading {...{ setView }} />}
      {view === 'home' && <Home {...{ player, leaderboard, join }} />}
      {view === 'table' && <Table {...{ gameState, munch, toggleReady }} />}
      {view === 'postgame' && <PostGame {...{ join, home }} />}
    </div>
  );
}

export default App;
