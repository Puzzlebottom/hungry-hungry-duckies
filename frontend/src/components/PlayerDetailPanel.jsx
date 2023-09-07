export default function PlayerDetailPanel({ name, current_seat, current_score, isReady, toggleReady }) {

  const seats = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <div className={'player-detail-panel player-detail-panel__' + seats[current_seat]}>
      <span className='player-name'>{name}</span>
      <span className='score'>{current_score}</span>
      <button className='button__ready' onClick={toggleReady}>{isReady ? 'Ready!' : 'Ready?'}</button>
    </div>
  );
}
