export default function Leaderboard(props) {
  const { players } = props;
  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody className="leaderboard-body">
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