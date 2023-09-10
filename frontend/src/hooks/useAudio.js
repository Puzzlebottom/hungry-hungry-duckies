import { useState } from "react";
import quacks from "../assets/quacks";

const useAudio = () => {
  const [trackIndex, setTrackIndex] = useState(0);

  const quack = () => {
    const newTrackIndex = (trackIndex + 1) % quacks.length;
    const newTrack = quacks[newTrackIndex];

    if (newTrack) {
      newTrack.currentTime = 0;
      newTrack.play();
      setTrackIndex(newTrackIndex);
    }
  };

  return { quack };
};

export default useAudio;
