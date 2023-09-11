import PlayerDetailPanel from "./PlayerDetailPanel";
import Duckie from "./Duckie";

export default function Quarter({ images, player, isActive }) {
  const { name, current_seat, current_score, isReady, toggleReady, isMunching, showMessage } = player;

  return (
    <>
      <PlayerDetailPanel {...{ name, current_seat, current_score, isReady, toggleReady, isActive }} />
      <Duckie {...{ images, isMunching, seat: current_seat }} />
      {showMessage && <div className="message" style={{ fontSize: '100px', zIndex: '0' }}>{showMessage}</div>}
    </>
  );
}
