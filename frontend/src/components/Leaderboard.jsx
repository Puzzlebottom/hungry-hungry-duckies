import '../sass/Leaderboard.scss';
export default function Leaderboard({ leaderboard }) {

  const players = leaderboard.map((player, index) => {
    const { id, name, total_score } = player;
    return (
      <div key={id}>
        <span>{index + 1}</span>
        <span>{name}</span>
        <span>{total_score}</span>
      </div>
    );
  });

  return (
    <div className="leaderboard">
      <header>Leaderboard</header>
      <section>
        <div className='player-list-header'>
          <span>Rank</span>
          <span>Username</span>
          <span>Bugs</span>
        </div>
        <div className='player-list'>
          {players}
        </div>
      </section>
    </div >
  );
}
