import PlayerDetailPanel from "./PlayerDetailPanel";
import Duckie from "./Duckie";
import '../sass/Quarters.scss';

export default function Quarter({ images, player, isActive }) {
  const { name, current_seat, current_score, isReady, toggleReady, isMunching, showMessage } = player;
  const classNames = ['one', 'two', 'three', 'four'];

  return (
    <>
      <PlayerDetailPanel {...{ name, current_seat, current_score, isReady, toggleReady, isActive }} />
      <Duckie {...{ images, isMunching, seat: current_seat }} />
      {showMessage && <span className={`player-message ${classNames[current_seat]}`}>{showMessage}</span>}
    </>
  );
}
