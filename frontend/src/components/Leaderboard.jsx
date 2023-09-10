import '../sass/Leaderboard.scss';
export default function Leaderboard({ leaderboard }) {
  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <div className="leaderboard-div">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Bugs Munched!</th>
          </tr>
        </thead>
        <tbody className="leaderboard-body">
          {leaderboard.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
