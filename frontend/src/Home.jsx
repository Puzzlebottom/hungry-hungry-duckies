import '../public/stylesheets/Home.css';
import Leaderboard from './components/Leaderboard';
import PlayerNameForm from './components/PlayerNameForm';


function Home() {
const players = [{name: 'Player 1', hi_score: 100},
{name: 'Player 2', hi_score: 200},
{name: 'Player 3', hi_score: 300},
{name: 'Player 4', hi_score: 400},
{name: 'Player 5', hi_score: 500},
{name: 'Player 6', hi_score: 600},
{name: 'Player 7', hi_score: 700},
{name: 'Player 8', hi_score: 800},
{name: 'Player 9', hi_score: 900},
{name: 'Player 10', hi_score: 1000}];
const sortedPlayers = players.sort((a, b) => b.hi_score - a.hi_score);

  return (
    <main>
      <div className='hero'>
        <div className='logo'>
          <img src="https://i.redd.it/a7w8qv77ctl31.png"></img>
        </div>
        <section className='instructions'>
          <h3>Spacebar to eat bugs</h3>
          <h3>Spacebar to eat quack</h3>
        </section>
      </div >
      <div className='leaderboard-and-form'>
        <Leaderboard players={sortedPlayers}/>
        <PlayerNameForm />
      </div>
    </main>
  );
}

export default Home;
