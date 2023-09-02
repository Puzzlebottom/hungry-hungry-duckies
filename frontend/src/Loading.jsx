import '../public/stylesheets/Loading.css';

function Loading() {
  return (
    <main>
      <div className="loading-duck">
        <img src="http://placekitten.com/500/400"></img>
      </div>
      <h1 className='loading-message'>LOADING...</h1>
      <div>
        <h3>Spacebar to eat bugs</h3>
        <h3>Spacebar to eat quack</h3>
      </div>
    </main>
  );
}

export default Loading;
