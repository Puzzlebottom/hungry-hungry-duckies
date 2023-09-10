import Home from './Home';
import Table from './Table';
import PostGame from './PostGame';
import Loading from './Loading';
import useGame from './hooks/useGame';
import useAudioControl from './hooks/useAudioControl';

function App() {
  const { gameState, setView, player, leaderboard, join, munch, toggleReady, home, newGame } = useGame();

  const { view } = gameState;

  const audioControl = useAudioControl(view, {

  });

  return (
    <div className="App">
      {audioControl.audioElement}
      {view === 'loading' && <Loading {...{ setView }} />}
      {view === 'home' && <Home {...{ player, leaderboard, join }} />}
      {view === 'table' && <Table {...{ gameState, munch, toggleReady }} />}
      {view === 'postgame' && <PostGame {...{ gameState, home, newGame }} />}
    </div>
  );
}

export default App;
