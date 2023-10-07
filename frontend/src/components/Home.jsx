import '../sass/Home.scss';
import Leaderboard from './Leaderboard';
import PlayerNameForm from './PlayerNameForm';
import Images from '../assets/images';
import LINKS from "../constants/links";
import Background from './Background';

function Home({ player, leaderboard, join }) {
  const { HASSAN, JACKSON, CONOR } = LINKS.CVs;

  return (
    <main className='home'>
      <Background view={'home'} />
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
