import '../public/stylesheets/Home.css';
import Leaderboard from './components/Leaderboard';
import PlayerNameForm from './components/PlayerNameForm';
import { useState, useEffect } from 'react';
import axios from 'axios';

import combinedBackground from '../public/videos/handcraftedbackground.png';

function Home(props) {
  const { handleSubmission, defaultName, handleViewChange } = props;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/players')
      .then((response) => {
        console.log("RES FROM SERVER ==>", response.data.players);
        setPlayers(response.data.players);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main className='home-main'>
      <div className='home-hero'>
        <h1 className='home-title'>Hungry, Hungry Duckies!™</h1>
        <div className='home-logo'>
          <img src="https://i.gifer.com/XOsX.gif" alt="Duck Logo" />
        </div>
        <section className='home-instructions'>
          <h1>How To Play</h1>
          <h3>Press Spacebar to MUNCH! 😤</h3>
          <h3>Press Spacebar to quack! 🦆</h3>
          <div className='image-container top-left'>
            <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
          </div>
          <div className='image-container top-right'>
            <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
          </div>
        </section>
      </div>
      <div className='home-leaderboard-and-form'>
        <div className='image-container bottom-left'>
          <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
        </div>
        <div className='image-container bottom-right'>
          <img className="duck-image" src="https://gifdb.com/images/high/duck-happy-dance-76yta26qy8v77wfr.gif" alt="Background" />
        </div>

        <Leaderboard players={players} />
        <PlayerNameForm {...{ handleSubmission, defaultName, handleViewChange }} />
      </div>
    </main>
  );
}
export default Home;
