import '../public/stylesheets/Home.css';
import Leaderboard from './components/Leaderboard';
import PlayerNameForm from './components/PlayerNameForm';


function Home({ player, leaderboard, join }) {

  return (
    <main className='home-main'>
      <div className='home-hero'>
        <h1 className='home-title'>Hungry, Hungry Duckies!™</h1>
        <div className='home-logo'>

          <img src="https://i.redd.it/a7w8qv77ctl31.png"></img>
        </div>
        <section className='home-instructions'>
          <h1>How To Play</h1>
          <h3>Spacebar to MUNCH! 😤</h3>
          <h3>Spacebar to quack! 🦆</h3>
        </section>
      </div >
      <div className='home-leaderboard-and-form'>
        <Leaderboard {...{ leaderboard }} />
        <PlayerNameForm {...{ player, join }} />
      </div>
    </main>
  );
}

export default Home;
