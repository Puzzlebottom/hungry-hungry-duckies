export default function PlayerDetailPanel({ name, seat, score, isReady, toggleReady }) {

  const seats = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <div className={'player-detail-panel player-detail-panel__' + seats[seat]}>
      <span className='player-name'>{name}</span>
      <span className='score'>{score}</span>
      <button className='button__ready' onClick={toggleReady}>{isReady ? 'Ready!' : 'Ready?'}</button>
    </div>
  );
}
