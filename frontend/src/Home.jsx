import './Home.css';

function Home() {
  return (
    <main>
      <div>
        <div className='logo'>
          <img src="http://placekitten.com/500/400"></img>
        </div>
        <section>
          <h3>Spacebar to eat bugs</h3>
          <h3>Spacebar to eat quack</h3>
        </section>
      </div >
      <div>
        <article className='leaderboard'>
          <header>Leaderboard</header>
          <ul>
            <li>1. Super Dude 25</li>
            <li>2. Super Dude 25</li>
            <li>3. Super Dude 25</li>
            <li>4. Super Dude 25</li>
            <li>5. Super Dude 25</li>
            <li>6. Super Dude 25</li>
            <li>7. Super Dude 25</li>
            <li>8. Super Dude 25</li>
            <li>9. Super Dude 25</li>
            <li>10. Super Dude 25</li>
          </ul>
        </article>
        <form className='player-name-form'>
          <input type='text' name='playerName' placeholder='Enter Player Name'></input>
        </form>
      </div>
    </main>
  );
}

export default Home;
