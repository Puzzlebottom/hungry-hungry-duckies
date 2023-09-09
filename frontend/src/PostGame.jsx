import React from 'react';
import '../src/sass/Postgame.scss';



function PostGame() {
  const Players = [
    { name: 'bob', score: 25, isWinner: true },
    { name: 'rob', score: 6, isWinner: false },
    { name: 'ronald', score: 21, isWinner: false },
    { name: 'bonald', score: 15, isWinner: false },
  ];






  const sortedPlayers = [...Players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <div className="background-container space"></div>
      <div className="background-container planets"></div>
      <div className="background-container meteors"></div>
      <div className="background-container stars"></div>
      <div className="Leaderboard-container-post">
        <h4 className="Winner">Leaderboard</h4>
        <div className="leaderboard-container-menu">
          <table className="true-leaderboard-table">
            <thead className="header-container-post">
              <tr>
                <th className="player-name-header">Player Name</th>
                <th className="player-score-header">Score</th>
                <th className="player-status-header">Status</th>
              </tr>
            </thead>
            <tbody className="post-game-playas">
              {sortedPlayers.map((player, index) => (
                <tr className={index === 0 ? 'custom-first-row' : 'player-column'} key={index}>
                  <td className="player-name">{player.name}</td>
                  <td className="player-score">{player.score}</td>
                  <td className={`player-status ${player.isWinner ? 'winner' : 'loser'}`}>
                    {player.isWinner ? 'Winner' : 'Loser'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="container-for-post-game-buttons">
          <button className="main-menu-button1">Main Menu</button>
          <button className="play-again-button">Play again</button>
        </div>
        <div className="audiobutton"></div>
      </div>
    </div>
  );

}


export default PostGame
