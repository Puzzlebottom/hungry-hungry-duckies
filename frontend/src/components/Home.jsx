import '../sass/Home.scss';
import Leaderboard from './Leaderboard';
import PlayerNameForm from './PlayerNameForm';
import backgrounds from '../assets/wallpaper';
import Images from '../assets/images';
import LINKS from "../constants/links";
import { useEffect } from 'react';

function Home({ player, leaderboard, join }) {
  const [back, middle, fore] = backgrounds.Home;
  const { HASSAN, JACKSON, CONOR } = LINKS.CVs;

  useEffect(() => {
    const handleResize = () => {
      const ratio = document.body.clientHeight / 324;
      const background = document.querySelector('.background-container');
      background.style.transform = `scale(${ratio})`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });


  return (
    <main className='home'>
      <div className='background-container home' style={{ transform: `scale(${document.body.clientHeight / 324})` }}>
        <div className="layer back" style={{ backgroundImage: `url(${back})` }}></div>
        <div className="layer middle" style={{ backgroundImage: `url(${middle})` }}></div>
        <div className="layer fore" style={{ backgroundImage: `url(${fore})` }}></div>
      </div>
      <section className='panel'>
        <header>
          <span>Hungry Hungry Duckies!</span>
        </header>
        <img className='duckie-hero' src={Images.happyDuckie} alt="Duck logo" />
        <div className='instructions'>
          <span>How to play:</span>
          <span>Press Spacebar to MUNCH!</span>
          <span>Press Q to send messages</span>
        </div>
        <div className="credits">
          <span>
            <a className="link" href={HASSAN}>Hassan Issak</a>
            <a className="link" href={JACKSON}>Jackson Lionheart</a>
            <a className="link" href={CONOR}>Conor Meldrum</a>
          </span>
          <span>
            <a className="link" href={LINKS.REPO}>Check out the project on Github!</a>
          </span>
        </div>
      </section>
      <section className='panel'>
        <Leaderboard {...{ leaderboard }} />
        <div className='form-wrapper'>
          <img className='duck-image' src={Images.dancingDuckie} alt='Dancing duck' />
          < PlayerNameForm {...{ player, join }} />
          <img className='duck-image' src={Images.dancingDuckie} alt='Dancing duck' />
        </div>
      </section>
    </main >
  );
}
export default Home;
