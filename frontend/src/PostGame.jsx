import { useEffect, useRef } from 'react';
import '../src/sass/Postgame.scss';



function PostGame({ gameState, home, newGame }) {
  const players = useRef([]);
  const name = useRef('');

  useEffect(() => {
    name.current = gameState.player.name;
    players.current = [gameState.player, ...gameState.opponents].sort((a, b) => b.current_score - a.current_score);
  }, []);

  return (
    <div className="Leaderboard-container">

      <h1 className="Winner">Leaderboard</h1>
      <table className="true-leaderboard-table">
        <thead>
          <tr className="player-column-categories">
            <th className="player-name-header">Player Name</th>
            <th className="player-score-header">Score</th>
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
      <div className="audiobutton">

      </div>
    </div>
  );

}


export default PostGame;
