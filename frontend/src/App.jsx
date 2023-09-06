import { useState, useEffect } from 'react';
import Home from './Home';
import Table from './Table';
import PostGame from './PostGame';
import Loading from './Loading';
import PlaySound from './components/PlaySound.jsx';
import useApplicationData from './assets/hooks/useApplicationData';
function App() {

const {
  state,
  handleSubmission,
  handleDefaultName,
  handleViewChange
} = useApplicationData();

const { defaultName, view, leaderBoardPlayers } = state;

  const currentView = () => {
    switch (view) {
      case 'home':
        return <Home { ...{ handleSubmission, defaultName, handleViewChange, leaderBoardPlayers } } />;
      case 'table':
        return <Table { ...{ handleViewChange } } />;
      case 'postGame':
        return <PostGame { ...{ handleViewChange } } />;
      case 'loading':
        return <Loading  { ...{ handleViewChange } } />;
      default:
        return <Home { ...{ handleSubmission, defaultName, handleViewChange, leaderBoardPlayers } } />;
    }
  };

  // background music
  const [backgroundMusic, setBackgroundMusic] = useState(true);

  useEffect(() => {
    setBackgroundMusic(state.view === 'home');
  }, [state.view]);

  return (
    <div className="App">
    <PlaySound audioSource={
        view === 'loading' ? '/audio/Loadingmusic.mp3' :
        backgroundMusic ? '/audio/mainmenumusic.mp3' : '/audio/quacknoises.mp3'
      } />

      {currentView()}

    </div>
  );
}

export default App;
