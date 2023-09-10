import PlayerDetailPanel from "./PlayerDetailPanel";
import Duckie from "./Duckie";

export default function Quarter({ images, player, color, isActive }) {
  const { name, current_seat, current_score, isReady, toggleReady, isMunching } = player;

  return (
    <>
      <div className={'background background__' + color}></div>
      <PlayerDetailPanel {...{ name, current_seat, current_score, isReady, toggleReady, isActive }} />
      <Duckie {...{ images, isMunching, seat: current_seat }} />
    </>
  );
}
