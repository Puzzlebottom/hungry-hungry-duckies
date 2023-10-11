import '../sass/PlayerDetailPanel.scss';
import Images from '../assets/images';

export default function PlayerDetailPanel({ name, current_seat, current_score, isReady, toggleReady, isActive }) {

  const seats = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <section className={`player-detail-panel ${seats[current_seat]}`}>
      <span>{name}</span>
      <span>
        {current_score}
        <img src={Images.bugs.bug1} />
      </span>
      {!isActive && <button className={isReady ? 'ready' : ''} onClick={toggleReady}>{isReady ? 'Ready!' : 'Ready?'}</button>}
    </section>
  );
}
