import '../sass/Home.scss';
import '../sass/HomeBackground.scss';
import Leaderboard from './Leaderboard';
import PlayerNameForm from './PlayerNameForm';
import backgrounds from '../assets/wallpaper';
import Images from '../assets/images';
import Credits from './Credits';

function Home({ player, leaderboard, join }) {

  return (
    <main className='home-main-screen'>
      <div className='background-container sky' style={{ backgroundImage: `url(${backgrounds.Home[0]})` }}></div>
      <div className='background-container mountain' style={{ backgroundImage: `url(${backgrounds.Home[1]})` }}></div>
      <div className='background-container clouds' style={{ backgroundImage: `url(${backgrounds.Home[2]})` }}></div>
      <div className='home-hero'>
        <h1>
          <span className="first-word">Hungry </span>
          <span className="second-word">Hungry</span>
          <span className="third-word">Duckies!™</span>
        </h1>
        <div className='home-logo'>
          <img src={Images.happyDuckie} alt="Duck Logo" />
        </div>
        <section className='home-instructions'>
          <h2 className="instructions-header">How to play:</h2>
          <h3>Press Spacebar to MUNCH!</h3>
        </section>
        <Credits />
      </div>
      <div className='home-leaderboard-and-form'>
        <div className="duck-image-container-1">
          <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Duck" />
        </div>
        <div className='image-container top-right'>
          <div className='image-container bottom-right'></div>
        </div>
        <div className="duck-image-container-real">
          <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Duck" />
        </div>
        <Leaderboard {...{ leaderboard }} />
        <PlayerNameForm {...{ player, join }} />
      </div>
    </main>
  );
}
export default Home;
