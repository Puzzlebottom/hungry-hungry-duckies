import React from 'react';
import '../public/stylesheets/Postgame.css';

function PostGame() {
  const Players = [
    { name: 'bob', score: 25, isWinner: true },
    { name: 'rob', score: 6, isWinner: false },
    { name: 'ronald', score: 21, isWinner: false },
    { name: 'bonald', score: 15, isWinner: false },
  ];






  const sortedPlayers = [...Players].sort((a, b) => b.score - a.score);

  return (
    <div className="Leaderboard-container">
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr className="playere-column-categories">
            <th>Player Name</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr className="player-column" key={index}>
              <td>{player.name}</td>
              <td>{player.score}</td>
              <td>{player.isWinner ? 'Winner' : 'Loser'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="container-for-post-game-buttons">
        <button classname="main-menu-button">Main Menu</button>
        <button classname="play-again-button">Play again</button>
      </div>
    </div>
  )
};

export default PostGame
