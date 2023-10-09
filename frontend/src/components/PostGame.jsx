import { useEffect, useRef } from 'react';
import Background from './Background';
import '../sass/PostGame.scss';
import '../sass/PostGameLeaderboard.scss';
import '../sass/PostGameBackground.scss';

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

      {/* <div className="background-container space" style={{ backgroundImage: `url(${backgrounds.PostGame[0]})` }}></div>
      <div className="background-container planets" style={{ backgroundImage: `url(${backgrounds.PostGame[1]})` }}></div>
      <div className="background-container meteors" style={{ backgroundImage: `url(${backgrounds.PostGame[2]})` }}></div>
      <div className="background-container stars" style={{ backgroundImage: `url(${backgrounds.PostGame[3]})` }}></div>
      <div className="Leaderboard-container-post">
        <h4 className="Winner">Leaderboard</h4>
        <div className="leaderboard-container-menu">
          <table className="true-leaderboard-table">
            <thead className="header-container-post">
              <tr>
                <th className="player-name-header">Player Name</th>
                <th className="player-score-header">Bugs Munched!</th>
                <th className="player-status-header">Status</th>
              </tr>
            </thead>
            <tbody className="post-game-playas">
              {players.current.map((player, index) => (
                <tr className={index === 0 ? 'custom-first-row' : 'player-column'} key={index}>
                  <td className="player-name">{player.name}</td>
                  <td className="player-score">{player.current_score}</td>
                  <td className={`player-status ${index === 0 ? 'winner' : 'loser'}`}>
                    {index === 0 ? 'Winner' : 'Loser'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="container-for-post-game-buttons">
            <button className="main-menu-button1" onClick={() => home()}>Main Menu</button>
            <button className="play-again-button" onClick={() => newGame(name.current)}>Play again</button>
          </div>
          <div className="audiobutton" />
        </div>
      </div> */}
    </main>
  );
}



export default PostGame;
