import '../public/stylesheets/Home.css';
import Leaderboard from './components/Leaderboard';
import PlayerNameForm from './components/PlayerNameForm';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Home() {
// const players = [{name: 'Player 1', hi_score: 100},
// {name: 'Player 2', hi_score: 200},
// {name: 'Player 3', hi_score: 300},
// {name: 'Player 4', hi_score: 400},
// {name: 'Player 5', hi_score: 500},
// {name: 'Player 6', hi_score: 600},
// {name: 'Player 7', hi_score: 700},
// {name: 'Player 8', hi_score: 800},
// {name: 'Player 9', hi_score: 900},
// {name: 'Player 10', hi_score: 1000}];
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


const sortedPlayers = players.sort((a, b) => b.hi_score - a.hi_score);

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
        <Leaderboard players={sortedPlayers}/>
        <PlayerNameForm />
      </div>
    </main>
  );
}

export default Home;
