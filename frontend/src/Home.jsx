import '../public/stylesheets/Home.css';
import Leaderboard from './components/Leaderboard';
import PlayerNameForm from './components/PlayerNameForm';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Home() {

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
    <main>
      <div className='hero'>
        <h1 className='title'>Hungry, Hungry Duckies!™</h1>
        <div className='logo'>
          <img src="https://i.redd.it/a7w8qv77ctl31.png"></img>
        </div>
        <section className='instructions'>
          <h1>How To Play</h1>
          <h3>Spacebar to MUNCH! 😤</h3>
          <h3>Spacebar to quack! 🦆</h3>
        </section>
      </div >
      <div className='leaderboard-and-form'>
        <Leaderboard players={players}/>
        <PlayerNameForm />
      </div>
    </main>
  );
}

export default Home;
