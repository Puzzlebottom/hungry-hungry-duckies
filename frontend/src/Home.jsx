import '../public/stylesheets/Home.css';

function Home() {
  return (
    <main>
      <div>
        <div className='logo'>
          <img src="https://i.redd.it/a7w8qv77ctl31.png"></img>
        </div>
        <section>
          <h3>Spacebar to eat bugs</h3>
          <h3>Spacebar to eat quack</h3>
        </section>
      </div >
      <div>
        <form className='player-name-form'>
          <input type='text' name='playerName' placeholder='Enter Player Name'></input>
        </form>
      </div>
    </main>
  );
}

export default Home;
