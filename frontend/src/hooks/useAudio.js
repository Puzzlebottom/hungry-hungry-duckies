import { useRef, useState } from "react";
import Sounds from "../assets/audio";

const useAudio = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [loading, menu, theme] = useRef(Sounds.music).current;
  const quacks = useRef(Sounds.quacks);
  const audioPlayer = useRef();

  const getAudioPlayerRef = () => audioPlayer;

  const quack = (seatIndex) => {
    audioPlayer.current.src = quacks.current[seatIndex];
    audioPlayer.current.currentTime = 0;
    audioPlayer.current.play();
  };

  const playMusic = (view) => {
    audioPlayer.current.src = getTrack(view);
    audioPlayer.current.play();
  };

  const toggleMute = () => {
    audioPlayer.current.muted = !audioPlayer.current.muted;
    setIsMuted(audioPlayer.current.muted);
  };

  const getTrack = (view) => {
    let track;
    if (view === 'home' || view === 'postgame') track = menu;
    if (view === 'loading') track = loading;
    if (view === 'table') track = theme;
    return track;
  };

  return { getAudioPlayerRef, quack, playMusic, isMuted, toggleMute };
};

export default useAudio;
