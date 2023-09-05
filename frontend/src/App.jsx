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

  return (
    <div className="App">
       <PlaySound />
      {currentView()}
    </div>
  );
}

export default App;
