import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Leaderboard() {
const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('/api/players')
      .then((response) => {
        const sortedPlayers = response.data.sort((a, b) => b.hi_score - a.hi_score);
        setPlayers(sortedPlayers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.hi_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
