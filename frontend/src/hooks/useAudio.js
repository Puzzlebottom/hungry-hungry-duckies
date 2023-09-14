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
    audioPlayer.current.volume = 0.3;
    audioPlayer.current.play();
  };

  const playMusic = (music) => {
    const tracks = { loading, menu, theme };
    audioPlayer.current.src = tracks[music];
    audioPlayer.current.volume = 0.08;
    audioPlayer.current.play();
  };

  const toggleMute = () => {
    audioPlayer.current.muted = !audioPlayer.current.muted;
    setIsMuted(audioPlayer.current.muted);
  };

  return { getAudioPlayerRef, quack, playMusic, isMuted, toggleMute };
};

export default useAudio;
