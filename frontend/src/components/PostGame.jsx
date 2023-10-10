import { useEffect, useRef } from 'react';
import Background from './Background';
import '../sass/PostGame.scss';


function PostGame({ gameState, home, newGame }) {
  const players = useRef([]);
  const name = useRef('');

  useEffect(() => {
    name.current = gameState.player.name;
    players.current = [gameState.player, ...gameState.opponents].sort((a, b) => b.current_score - a.current_score);
  }, []);


  return (
    <main className='postgame'>
      <Background view={'postgame'} />
      <section>
        <header>Congratulations!</header>
        <div>
          <span>Player Name</span>
          <span>Bugs Munched</span>
          <span>Results</span>
        </div>
        {players.current.map(({ name, current_score }, index) => (
          <div key={index}>
            <span>{name}</span>
            <span>{current_score}</span>
            <span>{index === 0 ? 'Winner' : 'Loser'}</span>
          </div>
        ))}
        <nav>
          <button onClick={home}>Main Menu</button>
          <button onClick={() => newGame(name.current)}>Play again</button>
        </nav>
      </section>
    </main>
  );
}



export default PostGame;
