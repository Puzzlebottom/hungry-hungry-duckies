import '../public/stylesheets/Home.css';
import Leaderboard from './components/Leaderboard';
import PlayerNameForm from './components/PlayerNameForm';

function Home({ player, leaderboard, join }) {

  return (
    <main className='home-main'>
      <div className='home-hero'>
        <h1 className='home-title'>Hungry, Hungry Duckies!™</h1>
        <div className='home-logo'>
          <img src="https://i.gifer.com/XOsX.gif" alt="Duck Logo" />
        </div>
        <section className='home-instructions'>
          <h1>How To Play</h1>
          <h3>Spacebar to MUNCH! 😤</h3>
          <h3>Spacebar to quack! 🦆</h3>
          {/* Add two duck images inside home-hero */}
          <div className='image-container top-left'>
            <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
          </div>
          <div className='image-container top-right'>
            <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
          </div>
          {/* End of duck images in home-hero */}
        </section>
      </div>
      <div className='home-leaderboard-and-form'>
        {/* Add two duck images inside home-leaderboard-and-form */}
        <div className='image-container bottom-left'>
          <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
        </div>
        <div className='image-container bottom-right'>
          <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
        </div>
        {/* End of duck images in home-leaderboard-and-form */}
        <Leaderboard {...{ leaderboard }} />
        <PlayerNameForm {...{ player, join }} />
      </div>
    </main>
  );
}
export default Home;
