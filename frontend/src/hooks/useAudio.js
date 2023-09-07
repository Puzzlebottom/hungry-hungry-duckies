import { useState } from "react";
import quacks from "../assets/quacks";

const useAudio = () => {
  const [track, setTrack] = useState(quacks[0]);

  const quack = () => {
    if (track) track.currentTime = 0;
    track.play();
  };

  return { quack };
};

export default useAudio

