import React from 'react';
import '../public/stylesheets/Postgame.css';
import videoBackground from '../public/videos/Wormhole Animation.mp4';
import PlaySound from './components/PlaySound.jsx';


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
      <video className="background-video" autoPlay loop muted>
        <source src={videoBackground} type="video/mp4" />
      </video>
      <PlaySound />
      <h1 className="Winner">Leaderboard</h1>
      <table className="leaderboard-table">
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
        <button className="main-menu-button">Main Menu</button>
        <button className="play-again-button">Play again</button>
      </div>
    </div>
  )
};

export default PostGame
